import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: "'Nunito', sans-serif", // Replace with your custom font
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none", // Disable uppercase text for all buttons
        },
      },
    },
  },
});

export default theme;
