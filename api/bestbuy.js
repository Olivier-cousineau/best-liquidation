export default async function handler(req, res) {
  const apiKey = process.env.BESTBUY_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Missing BESTBUY_API_KEY' });
  }
  res.status(200).json({ message: 'Proxy ready for Best Buy API once key is active' });
}