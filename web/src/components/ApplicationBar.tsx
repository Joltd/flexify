import { AppBar, Avatar, IconButton, Link, Stack, Toolbar, Typography, useTheme } from "@mui/material";
import AppsIcon from "@mui/icons-material/Apps";
import { API_URL, URL } from "@/lib/urls";
import { useApi } from "@/lib/api";
import { useEffect } from "react";
import { useBreakpoints } from "@/lib/breakpoints";
import { UserRecord } from "@/lib/types";

export interface ApplicationBarProps {
  title?: String;
}

export function ApplicationBar({
  title
}: ApplicationBarProps) {
  const { isExtraSmall } = useBreakpoints()
  const { get, data } = useApi<UserRecord>(API_URL.user.me)

  useEffect(() => {
    get()
  }, []);

  return <AppBar position="sticky" sx={{ padding: "0 16px 0 8px" }}>
    <Toolbar sx={{ gap: 2 }} disableGutters>
      <Link href={URL.home} color="inherit">
        <IconButton
          size="large"
          color="inherit"
        >
          <AppsIcon />
        </IconButton>
      </Link>

      <Typography
        variant="h6"
        flexGrow={1}
      >
        {title}
      </Typography>

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
    </Toolbar>
  </AppBar>
}