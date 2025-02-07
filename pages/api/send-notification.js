const webPush = require('web-push');
const fs = require('fs');
const path = require('path');

// Configure VAPID keys
webPush.setVapidDetails(
  'mailto:your-email@example.com',
  'BDHU4tdju3yHIX5wQoU7YBrIpxoxOdIppHOphDph5Ef2QMI7yCG-xMT87B4ydEkVe17XFuz7eGKiR2NEGkZnOT0',
  'u9pz4YEpERJTiMj78Ch1oIRKteNd5iU5U_ibY4nHkVA'
);

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { message, recipients } = req.body;

  if (!message || !recipients) {
    return res.status(400).json({ error: 'Message and recipients are required' });
  }

  const subscriptionsFile = path.join(process.cwd(), 'subscriptions.json');
  const subscriptions = JSON.parse(fs.readFileSync(subscriptionsFile, 'utf8'));

  subscriptions.forEach(subscription => {
    webPush.sendNotification(subscription, JSON.stringify({ title: 'New Notification', body: message }))
      .then(response => console.log('Notification sent:', response))
      .catch(error => console.error('Error sending notification:', error));
  });

  res.status(200).json({ success: true, message: 'Notification sent successfully' });
}
