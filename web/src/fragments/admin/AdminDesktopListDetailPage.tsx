'use client'

import {
  Alert,
  AppBar, Avatar, Card, CardContent, Fab, Grid2,
  IconButton,
  List,
  ListItem, ListItemAvatar,
  ListItemButton, ListItemIcon,
  ListItemText, Skeleton,
  Stack,
  Toolbar,
  Typography
} from "@mui/material";
import AppsIcon from '@mui/icons-material/Apps';
import AddIcon from '@mui/icons-material/Add';
import PersonIcon from '@mui/icons-material/Person';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { MicroApp, MicroAppLabel, UserRecord } from "@/lib/types";
import { useEffect, useState } from "react";
import {
  CheckboxButtonGroup,
  CheckboxElement,
  FormContainer,
  PasswordElement,
  TextFieldElement,
  useForm
} from "react-hook-form-mui";
import { ApiOptions, useApi } from "@/lib/api";
import { URLS } from "@/lib/urls";
import { Box } from "@mui/system";

export interface AdminDesktopListDetailPageProps {
}

type FormInputs = {
  id: string | null
  login: string | null
  password: string | null
  deleted: boolean
  applications: MicroApp[]
}

const defaultValues = {
  id: null,
  login: null,
  password: null,
  deleted: false,
  applications: [],
}

export function AdminDesktopListDetailPage({}: AdminDesktopListDetailPageProps) {
  const application = useApi<MicroApp[]>(URLS.admin.application, [])
  const user = useApi<UserRecord[]>(URLS.admin.user, [])
  const userDetail = useApi<UserRecord>(URLS.admin.userId, {} as UserRecord)
  const [ showDetail, setShowDetail ] = useState(false)
  const form = useForm<FormInputs>({ defaultValues })

  const isNew = !form.getValues('id')

  useEffect(() => {
    user.get()
    application.get()
  }, []);

  useEffect(() => {
    form.reset(userDetail.data)
  }, [userDetail.data]);

  const handleNewUser = () => {
    form.reset(defaultValues)
    setShowDetail(true)
  }

  const handleSelectUser = (user: UserRecord) => {
    const pathParams = {
      id: user.id
    }
    setShowDetail(true)
    userDetail.get({ pathParams })
  }

  const handleBack = () => {
    form.reset(defaultValues)
    setShowDetail(false)
  }

  const handleSave = () => {
    const data = form.getValues()
    const options = { body: data } as ApiOptions

    if (isNew) {
      user.post(options)
        .then(() => {
          setShowDetail(false)
          user.get()
        })
    } else {
      options.pathParams = {
        id: data.id!!
      }
      userDetail.patch(options)
        .then(() => {
          setShowDetail(false)
          user.get()
        })
    }
  }

  const applicationPermission = (user: UserRecord) => {
    return user.applications.length
      ? user.applications.map(item => MicroAppLabel[item]).join(', ')
      : 'No permissions';
  }

  const list = <>

    {user.error && (
      <Alert sx={{ margin: "16px" }} severity="error">{user.error}</Alert>
    )}

    <Fab
      sx={{
        position: "absolute",
        bottom: 16,
        right: 16,
      }}
      color="primary"
      onClick={handleNewUser}
    >
      <AddIcon />
    </Fab>
  </>

  const detail = <>

  </>

  return <Box display="flex" flexDirection="column" height="100%">
    <AppBar position="static">
      <Toolbar sx={{ gap: 2 }}>
        <IconButton
          size="large"
          color="inherit"
          edge="start"
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
    <Grid2
      container
      padding="16px 200px"
      spacing={2}
      minHeight={0}
    >
      <Grid2 size={4} height="100%" overflow="auto">
        <List sx={{ overflow: "auto", boxSizing: "border-box", height: "100%", scrollbarWidth: "thin" }}>
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
            <ListItem disablePadding key={index}>
              <ListItemButton onClick={() => handleSelectUser(user)}>
                <ListItemAvatar>
                  <Avatar>
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={user.login}
                  secondary={applicationPermission(user)}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Grid2>
      <Grid2 size={8} height="100%" overflow="auto" sx={{ scrollbarWidth: "thin" }}>
        <FormContainer formContext={form} onSuccess={handleSave}>
          {userDetail.loading ? (
            <Stack margin="16px">
              <Skeleton width="100%" height="56px" />
              <Skeleton width="100%" height="56px" />
              <Skeleton width="40%" height="56px" />
            </Stack>
          ) : userDetail.error ? (
            <Alert sx={{ margin: "16px" }} severity="error">{userDetail.error}</Alert>
          ) : (
            <Stack
              spacing={2}
              margin="16px"
            >
              <Typography variant="h6">General</Typography>
              <TextFieldElement
                name="login"
                label="Login"
                required
                rules={{
                  minLength: { value: 3, message: 'Minimal length 3 symbols' }
                }}
              />
              <PasswordElement
                name="password"
                label="Password"
                required={isNew}
                rules={{
                  minLength: { value: 4, message: 'Minimal length 3 symbols' }
                }}
              />
              <CheckboxElement
                name="deleted"
                label="Deleted"
              />
              <Typography variant="h6">Apps</Typography>
              <CheckboxButtonGroup
                options={application.data.map(application => ({
                  id: application,
                  label: MicroAppLabel[application]
                }))}
                name="applications"
              />
            </Stack>
          )}
        </FormContainer>
      </Grid2>
    </Grid2>
  </Box>
}
