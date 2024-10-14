'use client'
import {
  Alert,
  AppBar,
  Avatar, Divider, Fab,
  Grid2,
  IconButton, Link,
  List,
  ListItem, ListItemAvatar,
  ListItemButton,
  ListItemText, Paper, Skeleton, Stack,
  Toolbar,
  Typography, useMediaQuery, useTheme
} from "@mui/material";
import AppsIcon from "@mui/icons-material/Apps";
import { useApi } from "@/lib/common/api";
import { microAppLabels, UserRecord } from "@/lib/common/types";
import { API_URL, URL } from "@/lib/urls";
import { Fragment, useEffect } from "react";
import { useRouter } from "next/navigation";
import AddIcon from "@mui/icons-material/Add";
import { useBreakpoints } from "@/lib/common/breakpoints";
import { ApplicationBar } from "@/components/common/ApplicationBar";
import { ResponsiveLayout } from "@/components/common/ResponsiveLayout";
import { ListSkeleton } from "@/components/common/skeleton/ListSkeleton";

export function AdminListPage() {
  const router = useRouter()
  const user = useApi<UserRecord[]>(API_URL.admin.user, [])
  const { isExtraSmall, isSmall } = useBreakpoints()

  useEffect(() => {
    user.get()
  }, []);

  const handleAdd = () => {
    router.push(`${URL.admin}/new`)
  }

  const handleClick = (user: UserRecord) => {
    router.push(`${URL.admin}/${user.id}`)
  }

  return <>
    <ApplicationBar title="Admin" />
    <ResponsiveLayout>
      {user.error ? (
        <Alert sx={{ margin: "16px" }} severity="error">{user.error || 'Unknown error'}</Alert>
      ) : !user.loading ? (
        <List>
          {user.data.map((user, index) => (
            <Fragment key={index}>
              {index > 0 && !isExtraSmall && !isSmall && <Divider component="li"/>}
              <ListItem key={index} disableGutters disablePadding={!isExtraSmall && !isSmall}>
                <ListItemButton
                  onClick={() => handleClick(user)}
                  sx={!isExtraSmall && !isSmall ? {height: "88px"} : {}}
                >
                  <ListItemAvatar>
                    <Avatar />
                  </ListItemAvatar>
                  <ListItemText
                    primary={user.login}
                    sx={!isExtraSmall ? {
                      flexGrow: 0,
                      width: "50%",
                    } : null}
                  />
                  {!isExtraSmall && (
                    <ListItemText
                      secondary={microAppLabels(user.applications) || 'No permissions'}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            </Fragment>
          ))}
          <Fab
            sx={{
              position: "fixed",
              bottom: "16px",
              right: "16px",
            }}
            color="primary"
            onClick={handleAdd}
          >
            <AddIcon/>
          </Fab>
        </List>
      ) : (
        <ListSkeleton />
      )}
    </ResponsiveLayout>
  </>
}