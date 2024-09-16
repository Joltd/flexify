'use client'
import { FormContainer, TextFieldElement, useForm } from "react-hook-form-mui";
import React from "react";
import { Button, Card, CardActions, CardContent, Paper, Stack } from "@mui/material";
import { Box } from "@mui/system";
import { useApi } from "@/lib/api";
import { useRouter } from "next/navigation";
import { URLS } from "@/lib/urls";

export function LoginPage() {
  const router = useRouter()
  const { post } = useApi(URLS.user.login, {})
  const form = useForm({ mode: "onBlur" })

  const handleLogin = () => {
    const body = form.getValues()
    post({ body })
      .then(() => router.push("/"))
  }

  return <>
    <FormContainer
      formContext={form}
      onSuccess={handleLogin}
    >
      <Box
        display="flex"
        width="100%"
        height="100vh"
        justifyContent="center"
        alignItems="center"
      >
        <Card sx={{ minWidth: "400px" }}>
          <CardContent>
            <Stack spacing={2}>
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
            </Stack>
          </CardContent>
          <CardActions>
            <Button
              type="submit"
              color="primary"
            >
              Login
            </Button>
          </CardActions>
        </Card>
      </Box>
    </FormContainer>
  </>
}