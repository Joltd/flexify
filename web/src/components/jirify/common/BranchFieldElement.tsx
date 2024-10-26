'use client'
import { Controller } from "react-hook-form";
import { BranchField } from "@/components/jirify/common/BranchField";

export interface SelectBranchElementProps {
  workspace: string
  repository: string
  name: string
  label?: string
  nameSuggestion?: string
  base?: boolean
  common?: boolean
  hidden?: boolean
  withAdd?: boolean
}

export function BranchFieldElement({
  workspace,
  repository,
  name,
  label = "Branch",
  nameSuggestion,
  base,
  common,
  hidden,
  withAdd,
}: SelectBranchElementProps) {
  return <Controller
    name={name}
    render={(props) =>
      <BranchField
        workspace={workspace}
        repository={repository}
        label={label}
        value={props.field.value}
        onChange={props.field.onChange}
        nameSuggestion={nameSuggestion}
        base={base}
        common={common}
        hidden={hidden}
        withAdd={withAdd}
      />}
  />
}