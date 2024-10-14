'use client'
import { createTheme, ThemeProvider } from "@mui/material";
import { ReactNode } from "react";

export interface ThemeProps {
  children: ReactNode;
}

const theme = createTheme({

})

export function Theme({ children }: ThemeProps) {
  return <ThemeProvider theme={theme}>
    {children}
  </ThemeProvider>
}
