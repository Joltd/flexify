'use client'
import { Controller } from "react-hook-form";
import { BranchField, CreateBranch } from "@/components/jirify/common/BranchField";

export interface SelectBranchElementProps {
  workspace: string
  repository: string
  name: string
  label?: string
  nameSuggestion?: string
}

export function BranchFieldElement({
  workspace,
  repository,
  name,
  label = "Branch",
  nameSuggestion,
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
      />}
  />
}