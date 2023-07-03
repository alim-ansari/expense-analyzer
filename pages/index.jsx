import * as React from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';

import Button from '@mui/material/Button';
import { CircularProgress } from '@mui/material';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/router';
const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export default function Index() {
  const router = useRouter();
  const { user, isLoading } = useUser();
  React.useEffect(() => {
    if (!isLoading && user) {
      router.push('/dashboard', '/dashboard', { shallow: false });
    }
  }, [user, isLoading]);
  return !isLoading && !user ? (
    <>
      <main>
        {/* Hero unit */}
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
          <Container maxWidth="sm" className="">
            <Typography component="h3" variant="h3" align="center" color="text.primary" gutterBottom sx={{ pb: 3 }}>
              Expense Analyzer
            </Typography>
            <Typography variant="h6" align="center" textAlign="justify" color="text.secondary" paragraph>
              A software designed to help individuals and businesses to conveniently monitor and manage financial
              transactions, categorize expenses, analyze spending patterns, set budgets, and gain valuable insights into
              their financial habits.
            </Typography>
            <Stack sx={{ pt: 3 }} direction="row" spacing={2} justifyContent="center">
              <Link role="button" href="/api/auth/login">
                <Button
                  maxWidth="sm"
                  className="bg-blue-500 hover:bg-blue-600 w-[92vw] ms:w-[550px] text-white"
                  varient="contained">
                  Log In
                </Button>
              </Link>
            </Stack>
          </Container>
        </Box>
      </main>
    </>
  ) : isLoading ? (
    <Box sx={{ display: 'flex', height: '100vh', width: '100vw' }}>
      <CircularProgress sx={{ margin: 'auto' }} />
    </Box>
  ) : (
    <Box sx={{ display: 'flex', height: '100vh', width: '100vw' }}>
      <CircularProgress sx={{ margin: 'auto' }} />
    </Box>
  );
}
