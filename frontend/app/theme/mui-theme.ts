"use client";

import { createTheme } from "@mui/material/styles";
import { blue, indigo, red, amber, emerald, slate } from "./colors";

const theme = createTheme({
  palette: {
    primary: {
      main: blue[500],
      light: blue[400],
      dark: blue[600],
      contrastText: "#ffffff",
    },
    secondary: {
      main: indigo[500],
      light: indigo[400],
      dark: indigo[600],
      contrastText: "#ffffff",
    },
    error: {
      main: red[500],
      light: red[400],
      dark: red[600],
    },
    warning: {
      main: amber[500],
      light: amber[400],
      dark: amber[600],
    },
    success: {
      main: emerald[500],
      light: emerald[400],
      dark: emerald[600],
    },
    background: {
      default: "#ffffff",
      paper: "#ffffff",
    },
    text: {
      primary: slate[800],
      secondary: slate[500],
    },
    grey: {
      50: slate[50],
      100: slate[100],
      200: slate[200],
      300: slate[300],
      400: slate[400],
      500: slate[500],
      600: slate[600],
      700: slate[700],
      800: slate[800],
      900: slate[900],
    },
  },
  typography: {
    fontFamily: [
      "var(--font-geist-sans)",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
    ].join(","),
    h1: { fontSize: "2.5rem", fontWeight: 700, lineHeight: 1.2 },
    h2: { fontSize: "2rem", fontWeight: 700, lineHeight: 1.3 },
    h3: { fontSize: "1.75rem", fontWeight: 600, lineHeight: 1.4 },
    h4: { fontSize: "1.5rem", fontWeight: 600, lineHeight: 1.4 },
    h5: { fontSize: "1.25rem", fontWeight: 600, lineHeight: 1.5 },
    h6: { fontSize: "1rem", fontWeight: 600, lineHeight: 1.5 },
    body1: { fontSize: "1rem", lineHeight: 1.5 },
    body2: { fontSize: "0.875rem", lineHeight: 1.5 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: { borderRadius: 8 },
  shadows: [
    "none",
    "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
    "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
    "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
    "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
    "0 25px 50px -12px rgb(0 0 0 / 0.25)",
    "0 25px 50px -12px rgb(0 0 0 / 0.25)",
    "0 25px 50px -12px rgb(0 0 0 / 0.25)",
    "0 25px 50px -12px rgb(0 0 0 / 0.25)",
    "0 25px 50px -12px rgb(0 0 0 / 0.25)",
    "0 25px 50px -12px rgb(0 0 0 / 0.25)",
    "0 25px 50px -12px rgb(0 0 0 / 0.25)",
    "0 25px 50px -12px rgb(0 0 0 / 0.25)",
    "0 25px 50px -12px rgb(0 0 0 / 0.25)",
    "0 25px 50px -12px rgb(0 0 0 / 0.25)",
    "0 25px 50px -12px rgb(0 0 0 / 0.25)",
    "0 25px 50px -12px rgb(0 0 0 / 0.25)",
    "0 25px 50px -12px rgb(0 0 0 / 0.25)",
    "0 25px 50px -12px rgb(0 0 0 / 0.25)",
    "0 25px 50px -12px rgb(0 0 0 / 0.25)",
    "0 25px 50px -12px rgb(0 0 0 / 0.25)",
    "0 25px 50px -12px rgb(0 0 0 / 0.25)",
    "0 25px 50px -12px rgb(0 0 0 / 0.25)",
    "0 25px 50px -12px rgb(0 0 0 / 0.25)",
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "0.375rem",
          padding: "0.5rem 1rem",
          fontSize: "1rem",
          fontWeight: 600,
          boxShadow: "none",
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "1rem",
          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
          transition: "all 0.3s ease",
          "&:hover": {
            boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "0.5rem",
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: blue[500],
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: blue[500],
              borderWidth: "2px",
            },
          },
        },
      },
    },
  },
  breakpoints: {
    values: { xs: 0, sm: 640, md: 768, lg: 1024, xl: 1280 },
  },
});

export default theme;
