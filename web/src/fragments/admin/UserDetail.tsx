import { useApi } from "@/lib/api";
import { CheckboxElement, FormContainer, TextFieldElement, useForm } from "react-hook-form-mui";
import { List, Stack, Typography } from "@mui/material";
import { useEffect } from "react";

export interface UserDetailProps {
  error: string | null;
  loading: boolean;
}

export function UserDetail({ error, loading }: UserDetailProps) {

  if (error) {

  }

  if (loading) {

  }

  return <Stack spacing={2}>
    <Typography>General</Typography>
    <TextFieldElement
      name="login"
      label="Login"
      required
    />
    <TextFieldElement
      name="password"
      label="Password"
      type="password"
      required
    />
    <CheckboxElement
      name="deleted"
      label="Deleted"
    />
    <Typography>Apps</Typography>
    <List>

    </List>
  </Stack>
}