import { csrf } from '../../lib/csrf';
import clientPromise from '../../lib/mongodb';

async function handler(req, res) {
  try {
    switch (req.method) {
      case 'POST':
        let { email } = req.body;
        const client = await clientPromise;
        const db = client.db('expense-analyzer');
        let user = await db.collection('users').findOne({ email });
        if (user) {
          res.json({ currency: user.currency });
        } else {
          let newUser = await db.collection('users').insertOne({ email: email, currency: 'INR' });
          res.json({ currency: newUser.currency });
        }
        break;
    }
  } catch (err) {
    res.json({ error: 'ISE' });
  }
}
export default csrf(handler);
