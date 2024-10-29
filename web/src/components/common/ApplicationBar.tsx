'use client'
import {
  AppBar,
  Avatar,
  Button,
  IconButton,
  Link,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import AppsIcon from "@mui/icons-material/Apps";
import { API_URL, URL } from "@/lib/urls";
import { useApi } from "@/lib/common/api";
import { useEffect } from "react";
import { useBreakpoints } from "@/lib/common/breakpoints";
import { UserRecord } from "@/lib/common/types";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DoneIcon from "@mui/icons-material/Done";
import { Box } from "@mui/system";

export interface ApplicationBarProps {
  title?: String
  navigationItems?: NavigationItem[]
  backButton?: string
  doneButton?: boolean
}

export interface NavigationItem {
  title: string
  url: string
}

export function ApplicationBar({
  title,
  navigationItems,
  backButton,
  doneButton,
}: ApplicationBarProps) {
  const { isExtraSmall } = useBreakpoints()
  const { get, data } = useApi<UserRecord>(API_URL.user.me)

  useEffect(() => {
    get()
  }, [])

  const renderAppButton = () => (
    <Link href={URL.home} color="inherit">
      <IconButton size="large" color="inherit">
        <AppsIcon />
      </IconButton>
    </Link>
  )

  const renderBackButton = () => (
    <Link href={backButton} color="inherit">
      <IconButton size="large" color="inherit">
        <ArrowBackIcon />
      </IconButton>
    </Link>
  )

  const renderTitle = () => (
    <Typography variant="h6" flexGrow={1}>
      {title}
    </Typography>
  )

  const renderNavigation = () => (
    <>
      {navigationItems?.map((item, index) => (
        <Button
          key={index}
          href={item.url}
          color="inherit"
          // variant={path === item.url ? "outlined" : "text"}
        >
          {item.title}
        </Button>
      ))}
      <Box flexGrow={1} />
    </>
  )

  const renderDoneButton = () => (
    <IconButton
      size="large"
      color="inherit"
      type="submit"
    >
      <DoneIcon />
    </IconButton>
  )

  const renderUserInfo = () => (
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
  )

  return <AppBar position="sticky" sx={{ padding: "0 16px 0 8px" }}>
    <Toolbar sx={{ gap: 2 }} disableGutters>
      {backButton ? renderBackButton() : renderAppButton()}
      {navigationItems ? renderNavigation() : renderTitle()}
      {doneButton ? renderDoneButton() : renderUserInfo()}
    </Toolbar>
  </AppBar>
}