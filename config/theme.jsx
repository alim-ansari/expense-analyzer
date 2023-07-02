import { createTheme } from '@mui/material/styles';
import { blue, red } from '@mui/material/colors';
// Create a theme instance.
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: blue[300]
    }
  }
});
export default theme;
