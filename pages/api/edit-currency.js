import clientPromise from '../../lib/mongodb';
import csrf from '../../lib/csrf';

export default async function handler(req, res) {
  try {
    await csrf(req, res);
    switch (req.method) {
      case 'POST':
        const { email, currency } = req.body;
        const client = await clientPromise;
        const db = client.db('expense-tracker');
        let result = await db.collection('users').updateOne({ email }, { $set: { currency } });
        res.json(result);
        break;
    }
  } catch (err) {
    res.json({ error: 'ISE' });
  }
}
