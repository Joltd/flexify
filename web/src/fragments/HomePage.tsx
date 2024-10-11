'use client'

import { Button, Stack } from "@mui/material";
import { FormContainer, useForm } from "react-hook-form-mui";
import { BranchFieldElement } from "@/components/jirify/common/BranchFieldElement";

export function HomePage() {
  const form = useForm({ mode: "onBlur" })

  const handleSuccess = () => {
    console.log(form.getValues())
  }

  return <Stack padding={1}>

    {/*<BranchField*/}
    {/*  workspace="2f0ea575-39d6-3e11-d2f0-b8a051625fa3"*/}
    {/*  value={value}*/}
    {/*  onChange={setValue} />*/}

    <FormContainer formContext={form} onSuccess={handleSuccess}>
      <BranchFieldElement
        workspace="2f0ea575-39d6-3e11-d2f0-b8a051625fa3"
        name="branch"
      />
      <Button type="submit">Send</Button>
    </FormContainer>
  </Stack>
}