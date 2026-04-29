import express from 'express';
import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.warn('WARNING: Missing Supabase credentials in .env');
}

const supabase = createClient(SUPABASE_URL || 'http://localhost', SUPABASE_SERVICE_KEY || 'dummy-key');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: parseInt(process.env.SMTP_PORT || '587'),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const getCarrierGateway = (carrier) => {
  const gateways = {
    att: 'txt.att.net',
    verizon: 'vtext.com',
    tmobile: 'tmomail.net',
    sprint: 'messaging.sprintpcs.com'
  };
  return gateways[carrier?.toLowerCase()] || null;
};

// Webhook for new Announcements
app.post('/api/webhooks/announcements', async (req, res) => {
  try {
    const { record, type } = req.body;
    
    // Only process inserts
    if (type !== 'INSERT') {
      return res.status(200).json({ message: 'Not an insert event' });
    }

    const title = record.title;

    // Fetch all Hosts who opted in to SMS
    const { data: hosts, error } = await supabase
      .from('profiles')
      .select('phone_number, carrier')
      .eq('role', 'host')
      .eq('sms_consent', true);

    if (error) throw error;
    if (!hosts || hosts.length === 0) {
      return res.status(200).json({ message: 'No opted-in hosts found' });
    }

    const emails = hosts.map(host => {
      const gateway = getCarrierGateway(host.carrier);
      if (gateway && host.phone_number) {
        const cleanedPhone = host.phone_number.replace(/\D/g, '');
        return `${cleanedPhone}@${gateway}`;
      }
      return null;
    }).filter(Boolean);

    if (emails.length === 0) {
      return res.status(200).json({ message: 'No valid phone/carrier combos found' });
    }

    // Send emails
    const mailOptions = {
      from: `"AGI Portal" <${process.env.SMTP_USER}>`,
      to: emails.join(','), // BCC or comma-separated TO
      subject: 'New AGI Announcement',
      text: `Alert: ${title}. Check AGI Portal for details.`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Announcement SMS sent to ${emails.length} hosts. Message ID: ${info.messageId}`);
    
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
    
    if (type !== 'INSERT') {
      return res.status(200).json({ message: 'Not an insert event' });
    }
    
    const senderId = record.sender_id;
    const { data: sender } = await supabase.from('profiles').select('role, family_name').eq('id', senderId).single();
    
    if (!sender || sender.role !== 'host') {
      return res.status(200).json({ message: 'Sender is not a host, ignoring.' });
    }

    // Fetch all Admins who opted in to SMS
    const { data: admins, error } = await supabase
      .from('profiles')
      .select('phone_number, carrier')
      .eq('role', 'admin')
      .eq('sms_consent', true);

    if (error) throw error;
    if (!admins || admins.length === 0) {
      return res.status(200).json({ message: 'No opted-in admins found' });
    }

    const emails = admins.map(admin => {
      const gateway = getCarrierGateway(admin.carrier);
      if (gateway && admin.phone_number) {
        const cleanedPhone = admin.phone_number.replace(/\D/g, '');
        return `${cleanedPhone}@${gateway}`;
      }
      return null;
    }).filter(Boolean);

    if (emails.length === 0) {
      return res.status(200).json({ message: 'No valid phone/carrier combos found for admins' });
    }

    const mailOptions = {
      from: `"AGI Portal" <${process.env.SMTP_USER}>`,
      to: emails.join(','), 
      subject: 'AGI Inbox Alert',
      text: `New msg from ${sender.family_name}. Log into AGI Portal to reply.`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Admin Message Alert sent to ${emails.length} admins. Message ID: ${info.messageId}`);
    
    return res.status(200).json({ success: true, count: emails.length });
  } catch (error) {
    console.error('Messages Webhook Error:', error);
    return res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`SMS Gateway running on port ${PORT}`);
});
