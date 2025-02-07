import { promises as fs } from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const subscription = req.body;
  const subscriptionsFile = path.join(process.cwd(), 'subscriptions.json');

  try {
    let subscriptions = [];
    try {
      const data = await fs.readFile(subscriptionsFile, 'utf8');
      subscriptions = JSON.parse(data);
    } catch (error) {
      console.error('Error reading subscriptions file:', error);
    }

    subscriptions.push(subscription);
    await fs.writeFile(subscriptionsFile, JSON.stringify(subscriptions, null, 2));

    res.status(200).json({ message: 'Subscription stored successfully' });
  } catch (error) {
    console.error('Error storing subscription:', error);
    res.status(500).json({ error: 'Failed to store subscription' });
  }
}
