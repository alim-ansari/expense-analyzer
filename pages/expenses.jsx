import { useUser } from '@auth0/nextjs-auth0/client';
import axios from 'axios';
import Layout from '../components/Layout';
import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { MdDelete } from 'react-icons/md';
import { Box, Snackbar, Stack } from '@mui/material';
import MuiAlert from '@mui/material/Alert';

import useCurrency from '../store/store';
import { setup } from '../lib/csrf';
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const AllExpenses = props => {
  const { user, isLoading } = useUser();
  const [allTransactions, setAllTransactions] = React.useState([]);
  const currency = useCurrency(state => state.currency);

  const deleteTransaction = async id => {
    let result = await axios.post('/api/delete-transaction', { id });
    if (result.data.acknowledged) {
      setOpen(true);
      const res = await axios.post(`/api/all-transactions`, { email: user?.email, type: 'expense' });
      const data = res.data.transactions;

      setAllTransactions(data);
    } else {
      setErrorOpen(true);
    }
  };
  const [open, setOpen] = React.useState(false);
  const [errorOpen, setErrorOpen] = React.useState(false);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setErrorOpen(false);
    setOpen(false);
  };
  React.useEffect(() => {
    async function fetchTransactions() {
      try {
        const res = await axios.post(`/api/all-transactions`, { email: user?.email, type: 'expense' });
        const data = res.data.transactions;

        setAllTransactions(data);
      } catch (err) {}
    }

    fetchTransactions();
    return () => {};
  }, [user?.email]);
  return (
    <Layout>
      <Stack spacing={2} sx={{ width: '100%' }}>
        <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="success" sx={{ width: '100%', color: 'white' }}>
            Deleted Successfully
          </Alert>
        </Snackbar>
      </Stack>
      <Stack spacing={2} sx={{ width: '100%' }}>
        <Snackbar open={errorOpen} autoHideDuration={3000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="error" sx={{ width: '100%', color: 'white' }}>
            Something Went Wrong
          </Alert>
        </Snackbar>
      </Stack>
      <h3 className="text-center text-2xl mb-4 font-bold">All Expenses</h3>
      <Box className="w-[80vw] m-auto ms:w-auto">
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Category</TableCell>
                <TableCell align="center">Amount</TableCell>
                <TableCell align="center">Type</TableCell>
                <TableCell align="center">Date</TableCell>
                <TableCell align="center">Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {allTransactions?.map((row, i) => (
                <TableRow key={i} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row">
                    {row.category}
                  </TableCell>
                  <TableCell align="center">
                    {currency} {row.amount}
                  </TableCell>
                  <TableCell align="center">Expense</TableCell>
                  <TableCell align="center">
                    {row.date ? new Date(row.date).toLocaleDateString('en-GB') : '-'}
                  </TableCell>
                  <TableCell align="center" className="flex justify-center">
                    <div role="button" onClick={() => deleteTransaction(row._id)}>
                      <MdDelete size="24px" />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Layout>
  );
};

export default AllExpenses;

export const getServerSideProps = setup(async ({ req, res }) => {
  return { props: {} };
});
