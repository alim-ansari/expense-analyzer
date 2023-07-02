import csrf from '../../lib/csrf';
import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  try {
    await csrf(req, res);
    switch (req.method) {
      case 'POST':
        let bodyObject = req.body;
        const client = await clientPromise;
        const db = client.db('expense-tracker');
        let myPost = await db.collection('transactions').insertOne(bodyObject);
        res.json(myPost);
        break;
    }
  } catch (err) {
    res.json({ error: 'ISE' });
  }
}
