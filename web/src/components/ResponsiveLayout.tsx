'use client'

import { Grid2 } from "@mui/material";
import { ReactNode } from "react";

export interface ResponsiveLayoutProps {
  children: ReactNode;
}

export function ResponsiveLayout({ children }: ResponsiveLayoutProps) {
  return <Grid2
      margin={{
        xs: "0",
        sm: "16px 32px",
        md: "32px auto",
        lg: "32px 200px",
        xl: "32px auto",
      }}
      width={{
        xs: "100%",
        sm: "calc(100% - 64px)",
        md: "836px",
        lg: "calc(100% - 400px)",
        xl: "1136px",
      }}
    >
    {children}
  </Grid2>
}