'use client'
import { AppBar, Avatar, IconButton, Link, Stack, Toolbar, Typography, useTheme } from "@mui/material";
import AppsIcon from "@mui/icons-material/Apps";
import { API_URL, URL } from "@/lib/urls";
import { useApi } from "@/lib/api";
import { useEffect } from "react";
import { useBreakpoints } from "@/lib/breakpoints";
import { UserRecord } from "@/lib/types";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DoneIcon from "@mui/icons-material/Done";

export interface ApplicationBarProps {
  title?: String;
  backButton?: string;
  doneButton?: boolean;
}

export function ApplicationBar({
  title,
  backButton,
  doneButton,
}: ApplicationBarProps) {
  const { isExtraSmall } = useBreakpoints()
  const { get, data } = useApi<UserRecord>(API_URL.user.me)

  useEffect(() => {
    get()
  }, []);

  return <AppBar position="sticky" sx={{ padding: "0 16px 0 8px" }}>
    <Toolbar sx={{ gap: 2 }} disableGutters>
      {backButton ? (
        <Link href={backButton} color="inherit">
          <IconButton size="large" color="inherit">
            <ArrowBackIcon />
          </IconButton>
        </Link>
      ) : (
        <Link href={URL.home} color="inherit">
          <IconButton size="large" color="inherit">
            <AppsIcon />
          </IconButton>
        </Link>
      )}

      <Typography
        variant="h6"
        flexGrow={1}
      >
        {title}
      </Typography>

      {doneButton ? (
        <IconButton
          size="large"
          color="inherit"
          type="submit"
        >
          <DoneIcon />
        </IconButton>
      ) : (
        <Link
          href={URL.user}
          color="inherit"
          underline="none"
        >
          {isExtraSmall ? (
            <Avatar sx={{ width: "30px", height: "30px" }} />
          ) : (
            <Stack
              direction="row"
              gap={2}
              alignItems="center"
            >
              <Typography>
                {data.login}
              </Typography>
              <Avatar sx={{ width: "30px", height: "30px" }} />
            </Stack>
          )}
        </Link>
      )}
    </Toolbar>
  </AppBar>
}