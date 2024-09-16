'use client'
import { useApi } from "@/lib/api";
import { MicroApp, MicroAppLabel, UserRecord } from "@/lib/types";
import { URLS } from "@/lib/urls";
import { useEffect } from "react";
import {
  Alert,
  AppBar, Avatar, Divider, Fab, Grid2,
  IconButton, List,
  ListItem, ListItemAvatar,
  ListItemButton,
  ListItemText, Paper,
  Skeleton,
  Toolbar,
  Typography
} from "@mui/material";
import AppsIcon from "@mui/icons-material/Apps";
import AddIcon from "@mui/icons-material/Add";
import PersonIcon from "@mui/icons-material/Person";

export function AdminDesktopPage() {
  const application = useApi<MicroApp[]>(URLS.admin.application, [])
  const user = useApi<UserRecord[]>(URLS.admin.user, [])

  useEffect(() => {
    user.get()
    application.get()
  }, []);

  const handleNewUser = () => {

  }

  const handleSelectUser = (user: UserRecord) => {

  }

  const applicationPermission = (user: UserRecord) => {
    return
      : 'No permissions';
  }

  const list = <>
    <AppBar position="static">
      <Toolbar disableGutters>
        <IconButton
          size="large"
          color="inherit"
          sx={{
            margin: "8px"
          }}
        >
          <AppsIcon />
        </IconButton>
        <Typography
          variant="h6"
          flexGrow={1}
        >
          Admin
        </Typography>
      </Toolbar>
    </AppBar>
    <Paper
      variant="outlined"
      sx={{
        margin: "16px 200px"
      }}
    >
      {user.error ? (
        <Alert sx={{ margin: "16px" }} severity="error">{user.error}</Alert>
      ) : (
        <List sx={{ padding: 0, flexGrow: 1, overflow: "auto" }}>
          {user.loading && (
            <>
              <ListItem>
                <Skeleton width="100%" height="2em" />
              </ListItem>
              <ListItem>
                <Skeleton width="100%" height="2em" />
              </ListItem>
              <ListItem>
                <Skeleton width="100%" height="2em" />
              </ListItem>
            </>
          )}
          {user.data.map((user, index) => (
            <>
              {index > 0 && <Divider component="li" />}
              <ListItem disablePadding key={index}>
                <ListItemButton onClick={() => handleSelectUser(user)} sx={{ height: "96px" }}>
                  <ListItemAvatar sx={{ marginLeft: "32px" }}>
                    <Avatar>
                      <PersonIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={user.login}
                  />
                  <ListItemText primary={applicationPermission(user)} />
                </ListItemButton>
              </ListItem>
            </>
          ))}
        </List>
      )}
    </Paper>
    <Fab
      sx={{
        position: "fixed",
        bottom: 16,
        right: 216,
      }}
      color="primary"
      onClick={handleNewUser}
    >
      <AddIcon />
    </Fab>
  </>

  return <>
    {list}
  </>
}