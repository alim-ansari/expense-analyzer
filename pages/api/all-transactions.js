import { csrf } from '../../lib/csrf';
import clientPromise from '../../lib/mongodb';

async function handler(req, res) {
  try {
    switch (req.method) {
      case 'POST':
        if (req.body?.email) {
          const client = await clientPromise;
          const db = client.db('expense-analyzer');
          let allTransactions;
          switch (req.body?.type) {
            case 'saving':
              allTransactions = await db
                .collection('transactions')
                .find({ email: req.body.email, type: 'saving' })
                .toArray();
              res.json({ status: 200, transactions: allTransactions });
              break;
            case 'expense':
              allTransactions = await db
                .collection('transactions')
                .find({ email: req.body.email, type: 'expense' })
                .toArray();
              res.json({ status: 200, transactions: allTransactions });
              break;
            default:
              allTransactions = await db.collection('transactions').find({ email: req.body.email }).toArray();
              res.json({ status: 200, transactions: allTransactions });
              break;
          }
        } else {
          res.json({ status: 200, transactions: [] });
        }
        break;
    }
  } catch (err) {
    res.json({ error: 'ISE' });
  }
}
export default csrf(handler);
