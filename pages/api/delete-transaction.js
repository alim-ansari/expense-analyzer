import { ObjectId } from 'mongodb';
import clientPromise from '../../lib/mongodb';
import { csrf } from '../../lib/csrf';

async function handler(req, res) {
  try {
    switch (req.method) {
      case 'POST':
        let { id } = req.body;
        const client = await clientPromise;
        const db = client.db('expense-tracker');
        let result = await db.collection('transactions').deleteOne({ _id: new ObjectId(id) });
        res.json(result);
        break;
    }
  } catch (err) {
    res.json({ error: 'ISE' });
  }
}
export default csrf(handler);
