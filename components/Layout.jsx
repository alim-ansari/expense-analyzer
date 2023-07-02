import Head from 'next/head';
import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import {
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  OutlinedInput,
  Select
} from '@mui/material';
import { useUser } from '@auth0/nextjs-auth0/client';
import { useRouter } from 'next/router';
import { Dashboard } from '@mui/icons-material';
import PaymentsIcon from '@mui/icons-material/Payments';
import { Payment } from '@mui/icons-material';
import Link from 'next/link';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { TrendingDown } from '@mui/icons-material';
import axios from 'axios';
import useCurrency from '../store/store';
const pages = ['Products', 'Pricing', 'Blog'];
const settings = [{ name: 'Logout', href: '/api/auth/logout' }];

const drawerWidth = 240;
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
};
export default function Layout(props) {
  const router = useRouter();
  const { user, isLoading } = useUser();
  const [open, setOpen] = React.useState(false);
  const currency = useCurrency(state => state.currency);
  const [currencyVal, setCurrencyVal] = React.useState(currency);
  const setCurrency = useCurrency(state => state.setCurrency);

  const handleChange = event => {
    setCurrencyVal(event.target.value || '');
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason !== 'backdropClick') {
      setOpen(false);
    }
  };

  React.useEffect(() => {
    if (!isLoading && !user) {
      router.push('/', '/', { shallow: false });
    }
  }, [user, isLoading]);
  const { window, children } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleOpenNavMenu = event => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = event => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  const drawer = (
    <>
      <Dialog disableEscapeKeyDown open={open} onClose={handleClose}>
        <DialogTitle>Set Currency</DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ display: 'flex', flexWrap: 'wrap' }}>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="demo-dialog-select-label">Currency</InputLabel>
              <Select
                labelId="demo-dialog-select-label"
                id="demo-dialog-select"
                value={currencyVal}
                onChange={handleChange}
                input={<OutlinedInput label="Currency" />}>
                <MenuItem value={'INR'}>INR</MenuItem>
                <MenuItem value={'USD'}>USD</MenuItem>
                <MenuItem value={'AED'}>AED</MenuItem>
                <MenuItem value={'GBP'}>GBP</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={async () => {
              const result = await axios.post('/api/edit-currency', { email: user?.email, currency: currencyVal });
              if (result.data.acknowledged) {
                handleClose();
                setCurrency({ currency: currencyVal });
              }
            }}>
            Ok
          </Button>
        </DialogActions>
      </Dialog>
      <AppBar className="hidden ms:block">
        <Toolbar>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              flexGrow: 1,
              fontWeight: 500,
              color: 'inherit',
              textDecoration: 'none'
            }}>
            Expense Tracker
          </Typography>
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Expense Tracker" src={user?.picture} />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}>
              <MenuItem key={'2sdf34'} onClick={handleCloseUserMenu}>
                <Typography textAlign="center">
                  <span onClick={handleClickOpen}>Currency</span>
                </Typography>
              </MenuItem>
              {settings.map(setting => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">
                    <Link href={setting.href}>{setting.name}</Link>
                  </Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <List className="ms:mt-16 ms:ml-2">
        {[
          { name: 'Dashboard', href: '/dashboard' },
          { name: 'Add Savings', href: '/add-savings' },
          { name: 'Add Expenses', href: '/add-expenses' }
        ].map((text, index) => (
          <Link href={text.href} key={text.name}>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  {index === 0 ? <Dashboard /> : index === 1 ? <PaymentsIcon /> : index === 2 ? <Payment /> : <></>}
                </ListItemIcon>
                <ListItemText primary={text.name} />
              </ListItemButton>
            </ListItem>
          </Link>
        ))}
      </List>

      <List className="ms:ml-2">
        {[
          { name: 'All Savings', href: '/savings' },
          { name: 'All Expenses', href: '/expenses' }
        ].map((text, index) => (
          <Link href={text.href} key={text.name}>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  {index === 0 ? (
                    <TrendingUpIcon />
                  ) : index === 1 ? (
                    <TrendingDown />
                  ) : index === 2 ? (
                    <Payment />
                  ) : (
                    <></>
                  )}
                </ListItemIcon>
                <ListItemText primary={text.name} />
              </ListItemButton>
            </ListItem>
          </Link>
        ))}
      </List>
    </>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return !isLoading && user ? (
    <Box sx={{ display: 'flex' }}>
      <Head>
        <title>Expense Tracker</title>
      </Head>
      <CssBaseline />
      <AppBar
        position="fixed"
        variant=""
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` }
        }}>
        <Toolbar className="">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}>
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href=""
            sx={{
              flexGrow: 1,
              fontWeight: 500,
              textDecoration: 'none'
            }}>
            Expense Tracker
          </Typography>
          <Toolbar className="flex pr-0">
            <div>
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt="Expense Tracker" src={user?.picture} sx={{ width: 30, height: 30 }} />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: '45px' }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right'
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}>
                  {settings.map(setting => (
                    <MenuItem key={setting} onClick={handleCloseUserMenu}>
                      <Typography textAlign="center">
                        <Link href={setting.href}>{setting.name}</Link>
                      </Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            </div>
          </Toolbar>
        </Toolbar>
      </AppBar>
      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }} aria-label="mailbox folders">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }
          }}>
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }
          }}
          open>
          {drawer}
        </Drawer>
      </Box>
      <Box component="main" sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  ) : isLoading ? (
    <Box sx={{ display: 'flex', height: '100vh', width: '100vw' }}>
      <CircularProgress sx={{ margin: 'auto' }} />
    </Box>
  ) : (
    <></>
  );
}
