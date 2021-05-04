import { createMuiTheme } from "@material-ui/core";

const theme = createMuiTheme({
  palette: {
    primary: {
      50: "#effbf5",
      100: "#d7f6e6",
      200: "#bdf0d6",
      300: "#a3e9c6",
      400: "#8fe5b9",
      500: "#7be0ad",
      600: "#73dca6",
      700: "#68d89c",
      800: "#5ed393",
      900: "#4bcb83",
      A100: "#ffffff",
      A200: "#f2fff8",
      A400: "#bfffda",
      A700: "#a6ffcc",
    },
    secondary: {
      50: "#F9EBFA",
      100: "#EFCDF3",
      200: "#E5ACEC",
      300: "#DB8BE4",
      400: "#D372DE",
      500: "#CB59D8",
      600: "#C651D4",
      700: "#BE48CE",
      800: "#B83EC8",
      900: "#AC2EBF",
      A100: "#FFFFFF",
      A200: "#F8CEFF",
      A400: "#F19BFF",
      A700: "#EE82FF",
    },
  },
  zIndex: {
    appBar: 10000,
  },
});

export default theme;
