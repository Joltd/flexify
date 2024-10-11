'use client'

import { ApplicationBar } from "@/components/ApplicationBar";
import { ResponsiveLayout } from "@/components/ResponsiveLayout";
import {
  CheckboxButtonGroup,
  CheckboxElement,
  FormContainer,
  PasswordElement,
  TextFieldElement,
  useForm
} from "react-hook-form-mui";
import { ApiOptions, useApi } from "@/lib/common/api";
import { MicroApp, MicroAppLabel, UserRecord } from "@/lib/common/types";
import { API_URL, URL } from "@/lib/urls";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Alert, Skeleton, Stack, Typography } from "@mui/material";

export interface AdminDetailPageProps {
  id: string;
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

export function AdminDetailPage({ id }: AdminDetailPageProps) {
  const router = useRouter()
  const application = useApi<MicroApp[]>(API_URL.admin.application, [])
  const user = useApi<UserRecord>(API_URL.admin.userId)
  const form = useForm<FormInputs>({ defaultValues })

  const isNew = id === 'new'

  useEffect(() => {
    application.get()
    if (!isNew) {
      user.get({ pathParams: { id } })
    }
  }, []);

  useEffect(() => {
    form.reset(user.data)
  }, [user.data]);

  const handleSave = () => {
    const data = form.getValues()
    const options = { body: data } as ApiOptions

    if (isNew) {
      user.post(options).then(() => router.push(URL.admin))
    } else {
      options.pathParams = {
        id: data.id!!
      }
      user.patch(options).then(() => router.push(URL.admin))
    }
  }

  return <FormContainer formContext={form} onSuccess={handleSave}>
    <ApplicationBar title="Admin" backButton={URL.admin} doneButton />
    <ResponsiveLayout>
      {user.loading ? (
        <Stack margin="16px">
          <Skeleton width="100%" height="56px" />
          <Skeleton width="100%" height="56px" />
          <Skeleton width="40%" height="56px" />
        </Stack>
      ) : user.error ? (
        <Alert sx={{ margin: "16px" }} severity="error">{user.error}</Alert>
      ) : (
        <Stack
          spacing={2}
          margin="16px"
          maxWidth={400}
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
    </ResponsiveLayout>
  </FormContainer>
}