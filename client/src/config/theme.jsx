import { createTheme } from "@mui/material/styles";

let theme = createTheme({
  palette: {
    primary: {
      main: "#566573",
    },
    secondary: {
      main: "#D6DBDF",
    },
    background: {
      default: "#F5F5F5",
    },
  },
  responsiveFontSizes: true,
});

// theme = responsiveFontSizes(theme);

export default theme;
