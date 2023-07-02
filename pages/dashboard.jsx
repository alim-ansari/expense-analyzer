import React from 'react';
import Layout from '../components/Layout';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import axios from 'axios';
import { useUser } from '@auth0/nextjs-auth0/client';
import {
  Box,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography
} from '@mui/material';
import { Card } from '@mui/material';
import useCurrency from '../store/store';
import { MdPayments } from 'react-icons/md';
import { MdPayment } from 'react-icons/md';
import Link from 'next/link';
import Typewriter from 'typewriter-effect';
import { setup } from '../lib/csrf';
import { CircularProgress } from '@mui/material';

ChartJS.register(ArcElement, Tooltip, Legend);
function shuffle(array = COLORS.reverse()) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;
}
const COLORS = [
  'rgb(220,33,442)',
  'rgb(127,230,18)',
  'rgb(93,132,246)',
  'rgb(198,75,10)',
  'rgb(55,192,98)',
  'rgb(210,215,17)',
  'rgb(15,150,205)',
  'rgb(78,176,33)',
  'rgb(242,57,201)',
  'rgb(88,198,108)',
  'rgb(127,40,237)',
  'rgb(10,99,120)',
  'rgb(215,38,152)',
  'rgb(171,205,40)',
  'rgb(55,76,101)',
  'rgb(33,210,58)',
  'rgb(185,20,135)',
  'rgb(252,176,65)',
  'rgb(29,182,170)',
  'rgb(63,82,244)',
  'rgb(144,210,31)',
  'rgb(224,102,86)',
  'rgb(46,150,246)',
  'rgb(63,174,44)',
  'rgb(237,24,109)',
  'rgb(176,51,76)',
  'rgb(93,39,154)',
  'rgb(232,34,217)',
  'rgb(128,218,156)',
  'rgb(225,34,71)',
  'rgb(88,182,204)',
  'rgb(127,28,112)',
  'rgb(182,117,189)',
  'rgb(13,224,42)',
  'rgb(44,65,210)',
  'rgb(199,66,31)',
  'rgb(57,211,128)',
  'rgb(31,74,163)',
  'rgb(240,82,179)',
  'rgb(160,186,37)',
  'rgb(88,160,212)',
  'rgb(127,10,66)',
  'rgb(187,86,26)',
  'rgb(14,100,129)',
  'rgb(90,43,160)',
  'rgb(47,147,235)',
  'rgb(141,37,171)',
  'rgb(187,171,24)',
  'rgb(150,12,93)',
  'rgb(82,229,199)',
  'rgb(255,24,75)',
  'rgb(134,222,128)',
  'rgb(14,58,79)',
  'rgb(33,221,250)',
  'rgb(222,9,159)',
  'rgb(115,151,59)',
  'rgb(63,68,113)',
  'rgb(255,71,16)',
  'rgb(231,26,195)',
  'rgb(14,171,153)',
  'rgb(64,31,158)',
  'rgb(127,91,13)',
  'rgb(221,37,99)',
  'rgb(60,191,167)',
  'rgb(255,0,240)',
  'rgb(160,215,29)',
  'rgb(30,15,214)',
  'rgb(148,112,59)',
  'rgb(187,61,24)',
  'rgb(78,99,196)',
  'rgb(127,93,12)',
  'rgb(179,9,73)',
  'rgb(99,154,209)',
  'rgb(255,192,15)',
  'rgb(187,127,224)',
  'rgb(59,132,96)',
  'rgb(246,39,169)',
  'rgb(135,12,152)',
  'rgb(228,133,24)',
  'rgb(49,190,187)',
  'rgb(87,40,150)',
  'rgb(189,142,94)',
  'rgb(126,193,220)',
  'rgb(52,61,98)',
  'rgb(255,111,91)',
  'rgb(78,110,212)',
  'rgb(94,88,66)',
  'rgb(187,6,157)',
  'rgb(23,146,91)',
  'rgb(62,218,240)',
  'rgb(227,24,172)',
  'rgb(94,108,69)',
  'rgb(46,113,48)',
  'rgb(205,9,232)',
  'rgb(141,203,111)',
  'rgb(97,37,87)',
  'rgb(223,61,105)',
  'rgb(88,182,221)'
];
const Dashboard = props => {
  const donutOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        align: 'chartArea',
        reverse: true,
        labels: {
          color: 'white',
          font: {
            size: '16px'
          }
        }
      }
    }
  };
  const { user } = useUser();
  const [written, setWritten] = React.useState(false);
  const [saving, setSaving] = React.useState(0);
  const [expense, setExpense] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [savingsCategory, setSavingsCategory] = React.useState([]);
  const [expensesCategory, setExpensesCategory] = React.useState([]);

  const currency = useCurrency(state => state.currency);

  React.useEffect(() => {
    async function fetchTransactions() {
      try {
        const res = await axios.post(`/api/all-transactions`, { email: user?.email });
        const data = res.data.transactions;
        let saving = data.filter(t => t.type === 'saving').reduce((acc, obj) => acc + obj.amount, 0);
        let expense = data.filter(t => t.type === 'expense').reduce((acc, obj) => acc + obj.amount, 0);
        const savingsCategory = Array.from(
          data
            .filter(t => t.type === 'saving')
            .reduce((m, { category, amount }) => m.set(category, (m.get(category) || 0) + amount), new Map()),
          ([category, amount]) => ({ category, amount })
        );
        setSavingsCategory(savingsCategory);
        const expenseCategory = Array.from(
          data
            .filter(t => t.type === 'expense')
            .reduce((m, { category, amount }) => m.set(category, (m.get(category) || 0) + amount), new Map()),
          ([category, amount]) => ({ category, amount })
        );
        setExpensesCategory(expenseCategory);
        setSaving(saving);
        setExpense(expense);
      } catch (err) {}
    }
    fetchTransactions();
    setLoading(false);
    return () => {};
  }, [user?.email]);
  const data = {
    labels: ['Expenses', 'Savings'],
    datasets: [
      {
        label: 'Amount',
        data: [expense, saving],
        backgroundColor: ['rgb(185 28 28)', 'rgb(21 128 61)'],
        borderColor: ['rgb(185 28 28)', 'rgb(21 128 61)'],
        borderWidth: 1
      }
    ]
  };
  const savingsCategoryData = {
    labels: savingsCategory.map(s => s.category),
    datasets: [
      {
        label: 'Amount',
        data: savingsCategory.map(s => s.amount),
        backgroundColor: shuffle(),
        borderColor: shuffle(),
        borderWidth: 1
      }
    ]
  };
  const expensesCategoryData = {
    labels: expensesCategory.map(e => e.category),
    datasets: [
      {
        label: 'Amount',
        data: expensesCategory.map(e => e.amount),
        backgroundColor: shuffle(),
        borderColor: shuffle(),
        borderWidth: 1
      }
    ]
  };

  return loading ? (
    <Layout>
      <Box sx={{ display: 'flex', height: '100vh', width: '100vw' }}>
        <CircularProgress sx={{ margin: 'auto' }} />
      </Box>
    </Layout>
  ) : (
    <>
      <Box sx={{ mb: 1 }}>
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 12, md: 12 }}
          direction="row"
          justifyContent="space-around"
          alignItems="center"
          flexWrap="wrap">
          <Grid item xs={4}>
            <Box>
              <Card variant="outlined" className="bg-blue-700">
                <React.Fragment>
                  <CardContent>
                    <Typography variant="h5" component="div">
                      Balance
                    </Typography>
                    <Typography variant="bold">
                      {currency} {parseFloat(saving - expense).toFixed(2)}
                    </Typography>
                  </CardContent>
                </React.Fragment>
              </Card>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box>
              <Card variant="outlined" className="bg-green-700">
                <React.Fragment>
                  <CardContent>
                    <Typography variant="h5" component="div">
                      Savings
                    </Typography>
                    <Typography variant="bold">
                      {currency} {parseFloat(saving).toFixed(2)}
                    </Typography>
                  </CardContent>
                </React.Fragment>
              </Card>
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box>
              <Card variant="outlined" className="bg-red-700">
                <React.Fragment>
                  <CardContent>
                    <Typography variant="h5" component="div">
                      Expenses
                    </Typography>
                    <Typography variant="bold">
                      {currency} {parseFloat(expense).toFixed(2)}
                    </Typography>
                  </CardContent>
                </React.Fragment>
              </Card>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {expense == 0 && saving == 0 ? (
        <>
          {!written ? (
            <div className="text-xl  font-bold mt-4 pt-4 leading-relaxed">
              <Typewriter
                options={{
                  delay: 20,
                  deleteSpeed: 20,
                  autoStart: true,
                  loop: false
                }}
                onInit={typewriter => {
                  typewriter
                    .typeString('Add some transactions to view Information')
                    .pauseFor(300)
                    .deleteChars(11)
                    .typeString('Statistics...')
                    .pauseFor(2500)
                    .deleteAll()
                    .callFunction(() => {
                      setWritten(true);
                    })
                    .start();
                }}
              />
            </div>
          ) : (
            <Grid
              container
              direction="row"
              justifyContent="space-evenly"
              alignItems="center"
              spacing={2}
              className="mt-1">
              <Grid item xs={6}>
                <List>
                  <Link href={'/add-savings'} key={'Add Savings'}>
                    <ListItem disablePadding>
                      <ListItemButton>
                        <ListItemIcon>
                          <MdPayments size="24px" />
                        </ListItemIcon>
                        <ListItemText primary={'Add Savings'} />
                      </ListItemButton>
                    </ListItem>
                  </Link>
                </List>
              </Grid>

              <Grid item xs={6}>
                <List>
                  <Link href={'/add-expenses'} key={'Add Expenses'}>
                    <ListItem disablePadding>
                      <ListItemButton>
                        <ListItemIcon>
                          <MdPayment size="24px" />
                        </ListItemIcon>
                        <ListItemText primary={'Add Expenses'} />
                      </ListItemButton>
                    </ListItem>
                  </Link>
                </List>
              </Grid>
            </Grid>
          )}
        </>
      ) : (
        <Box sx={{ my: 4 }}>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 12, md: 12 }}
            direction="row"
            justifyContent="space-around"
            alignItems="center">
            <Grid item xs={4} sx={{ mb: 4 }}>
              <h3 className="text-center font-bold text-xl mb-4">Statistics</h3>
              <Doughnut data={data} options={donutOptions} />
            </Grid>
            <Grid item xs={4} sx={{ mb: 4 }}>
              <h3 className="text-center font-bold text-xl mb-4">Savings Categories</h3>
              <Doughnut data={savingsCategoryData} options={donutOptions} />
            </Grid>
            <Grid item xs={4} sx={{ mb: 4 }}>
              <h3 className="text-center font-bold text-xl mb-4">Expenses Categories</h3>
              <Doughnut data={expensesCategoryData} options={donutOptions} />
            </Grid>
          </Grid>
        </Box>
      )}
    </>
  );
};

export default Dashboard;

export const getServerSideProps = setup(async ({ req, res }) => {
  return { props: {} };
});
