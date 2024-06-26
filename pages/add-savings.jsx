import * as React from 'react';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Layout from '../components/Layout';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import axios from 'axios';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { Stack } from '@mui/material';
import { useUser } from '@auth0/nextjs-auth0/client';
import { setup } from '../lib/csrf';
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Savings(props) {
  const { user } = useUser();
  const [amount, setAmount] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [eamount, seteAmount] = React.useState(false);
  const [ecategory, seteCategory] = React.useState(false);
  const [date, setDate] = React.useState('');
  const handleSubmit = async event => {
    event.preventDefault();

    if (category && amount) {
      let submitData = {
        category: category,
        type: 'saving',
        email: user?.email,
        date: date,
        amount: Number(amount)
      };
      const result = await axios.post('/api/add-transaction', submitData);
      if (result.data.acknowledged) {
        setOpen(true);
        setAmount('');
        setCategory('');
        setDate('');
        seteAmount(false);
        seteCategory(false);
      } else {
        setErrorOpen(true);
      }
    } else {
      if (!category) seteCategory(true);
      if (!amount) seteAmount(true);
    }
  };

  const validate = function (e) {
    var t = e;
    t = t.indexOf('.') >= 0 ? t.substr(0, t.indexOf('.')) + t.substr(t.indexOf('.'), 3) : t;

    return t;
  };
  const [open, setOpen] = React.useState(false);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setErrorOpen(false);
    setOpen(false);
  };

  const [errorOpen, setErrorOpen] = React.useState(false);

  function formatAmount(amount) {
    if (amount === '') {
      return setAmount(amt => String(amount));
    } else if (amount.endsWith('.') && !amount.startsWith('.')) {
      return setAmount(amt => String(amount));
    } else if (amount.match(/^\d+(\.\d+)?$/)) {
      return setAmount(amt => String(validate(amount)));
    }
  }

  return (
    <Layout>
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
        <Stack spacing={2} sx={{ width: '100%' }}>
          <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="success" sx={{ width: '100%', color: 'white' }}>
              Saved Successfully
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
        <Typography component="h1" variant="h5">
          Add Saving Transaction
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="category"
            value={category}
            onChange={e => setCategory(e.target.value)}
            label="Category"
            name="category"
            error={category.length > 0 || !ecategory ? false : true}
            autoComplete="off"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="amount"
            label="Amount"
            name="amount"
            value={amount}
            error={amount.length > 0 || !eamount ? false : true}
            onChange={e => formatAmount(e.target.value)}
            autoComplete="off"
          />
          <DatePicker
            margin="normal"
            required
            fullWidth
            format="DD/MM/YYYY"
            id="date"
            label="Date (Optional)"
            timezone="system"
            name="date"
            onChange={value => setDate(value.$d.toISOString())}
            autoComplete="date"
            sx={{ my: 2 }}
            slotProps={{ textField: { fullWidth: true } }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className="bg-blue-500 hover:bg-blue-600 text-white"
            sx={{ mt: 3, mb: 2, p: 1 }}>
            Add Transaction
          </Button>
        </Box>
      </Box>
    </Layout>
  );
}

export const getServerSideProps = setup(async ({ req, res }) => {
  return { props: {} };
});
