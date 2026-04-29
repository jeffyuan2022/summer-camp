import express from 'express';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY;
const EMAILJS_PRIVATE_KEY = process.env.EMAILJS_PRIVATE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY || !EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY || !EMAILJS_PRIVATE_KEY) {
  console.warn('WARNING: Missing credentials in .env');
}

const supabase = createClient(SUPABASE_URL || 'http://localhost', SUPABASE_SERVICE_KEY || 'dummy-key');

const getCarrierGateway = (carrier) => {
  const gateways = {
    att: 'txt.att.net',
    verizon: 'vtext.com',
    tmobile: 'tmomail.net',
    sprint: 'messaging.sprintpcs.com'
  };
  return gateways[carrier?.toLowerCase()] || null;
};

const sendEmailJS = async (toEmail, subject, text) => {
  const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      service_id: EMAILJS_SERVICE_ID,
      template_id: EMAILJS_TEMPLATE_ID,
      user_id: EMAILJS_PUBLIC_KEY,
      accessToken: EMAILJS_PRIVATE_KEY,
      template_params: {
        to_email: toEmail,
        subject: subject,
        message: text
      }
    })
  });
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`EmailJS Error: ${errorText}`);
  }
  return true;
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

    await Promise.all(emails.map(email => sendEmailJS(email, 'New AGI Announcement', `Alert: ${title}. Check AGI Portal for details.`)));
    console.log(`Announcement SMS sent to ${emails.length} hosts.`);
    
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

    await Promise.all(emails.map(email => sendEmailJS(email, 'AGI Inbox Alert', `New msg from ${sender.family_name}. Log into AGI Portal to reply.`)));
    console.log(`Admin Message Alert sent to ${emails.length} admins.`);
    
    return res.status(200).json({ success: true, count: emails.length });
  } catch (error) {
    console.error('Messages Webhook Error:', error);
    return res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`SMS Gateway (EmailJS REST API) running on port ${PORT}`);
});
