import express from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { google } from 'googleapis';

dotenv.config();

const app = express();
app.use(express.json());

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const GMAIL_CLIENT_ID = process.env.GMAIL_CLIENT_ID;
const GMAIL_CLIENT_SECRET = process.env.GMAIL_CLIENT_SECRET;
const GMAIL_REFRESH_TOKEN = process.env.GMAIL_REFRESH_TOKEN;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY || !GMAIL_CLIENT_ID || !GMAIL_CLIENT_SECRET || !GMAIL_REFRESH_TOKEN) {
  console.warn('WARNING: Missing credentials in .env');
}

const supabase = createClient(SUPABASE_URL || 'http://localhost', SUPABASE_SERVICE_KEY || 'dummy-key');

// Setup Google OAuth2 client
const oAuth2Client = new google.auth.OAuth2(
  GMAIL_CLIENT_ID,
  GMAIL_CLIENT_SECRET,
  "https://developers.google.com/oauthplayground"
);

// Pass the refresh token, and googleapis automatically refreshes the access token when needed!
oAuth2Client.setCredentials({ refresh_token: GMAIL_REFRESH_TOKEN });

const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

const getCarrierGateway = (carrier) => {
  const gateways = {
    att: 'txt.att.net',
    verizon: 'vtext.com',
    tmobile: 'tmomail.net',
    sprint: 'messaging.sprintpcs.com'
  };
  return gateways[carrier?.toLowerCase()] || null;
};

const sendGmailApiEmail = async (toEmail, subject, text) => {
  // Gmail API requires raw RFC 2822 email payload, encoded in base64url
  const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
  const messageParts = [
    `To: ${toEmail}`,
    `Subject: ${utf8Subject}`,
    'Content-Type: text/plain; charset=utf-8',
    'MIME-Version: 1.0',
    '',
    text
  ];
  const message = messageParts.join('\r\n');
  
  // Base64url encode the message
  const encodedMessage = Buffer.from(message)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const response = await gmail.users.messages.send({
    userId: 'me',
    requestBody: {
      raw: encodedMessage,
    },
  });

  return response.data;
};

// Webhook for new Announcements
app.post('/api/webhooks/announcements', async (req, res) => {
  try {
    const { record, type } = req.body;
    if (type !== 'INSERT') return res.status(200).json({ message: 'Not an insert event' });

    const title = record.title;

    const { data: hosts, error } = await supabase
      .from('profiles')
      .select('phone_number, carrier')
      .eq('role', 'host')
      .eq('sms_consent', true);

    if (error) throw error;
    if (!hosts || hosts.length === 0) return res.status(200).json({ message: 'No opted-in hosts found' });

    const emails = hosts.map(host => {
      const gateway = getCarrierGateway(host.carrier);
      if (gateway && host.phone_number) {
        const cleanedPhone = host.phone_number.replace(/\D/g, '');
        return `${cleanedPhone}@${gateway}`;
      }
      return null;
    }).filter(Boolean);

    if (emails.length === 0) return res.status(200).json({ message: 'No valid phone/carrier combos found' });

    await Promise.all(emails.map(email => sendGmailApiEmail(email, 'AGI Alert', `New Announcement: ${title}.`)));
    console.log(`Announcement SMS sent to ${emails.length} hosts via Gmail API.`);
    
    return res.status(200).json({ success: true, count: emails.length });
  } catch (error) {
    console.error('Announcement Webhook Error:', error);
    return res.status(500).json({ error: error.message });
  }
});

// Webhook for new Direct Messages to Admins
app.post('/api/webhooks/messages', async (req, res) => {
  try {
    const { record, type } = req.body;
    if (type !== 'INSERT') return res.status(200).json({ message: 'Not an insert event' });
    
    const senderId = record.sender_id;
    const { data: sender } = await supabase.from('profiles').select('role, family_name').eq('id', senderId).single();
    
    if (!sender || sender.role !== 'host') return res.status(200).json({ message: 'Sender is not a host, ignoring.' });

    const { data: admins, error } = await supabase
      .from('profiles')
      .select('phone_number, carrier')
      .eq('role', 'admin')
      .eq('sms_consent', true);

    if (error) throw error;
    if (!admins || admins.length === 0) return res.status(200).json({ message: 'No opted-in admins found' });

    const emails = admins.map(admin => {
      const gateway = getCarrierGateway(admin.carrier);
      if (gateway && admin.phone_number) {
        const cleanedPhone = admin.phone_number.replace(/\D/g, '');
        return `${cleanedPhone}@${gateway}`;
      }
      return null;
    }).filter(Boolean);

    if (emails.length === 0) return res.status(200).json({ message: 'No valid phone/carrier combos found for admins' });

    await Promise.all(emails.map(email => sendGmailApiEmail(email, 'AGI Inbox', `New msg from ${sender.family_name}. Log into portal.`)));
    console.log(`Admin Message Alert sent to ${emails.length} admins via Gmail API.`);
    
    return res.status(200).json({ success: true, count: emails.length });
  } catch (error) {
    console.error('Messages Webhook Error:', error);
    return res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`SMS Gateway (Gmail API) running on port ${PORT}`);
});
