'use client'
import { Controller } from "react-hook-form";
import { BranchField } from "@/components/jirify/common/BranchField";

export interface SelectBranchElementProps {
  workspace: string;
  name: string;
}

export function BranchFieldElement({
  workspace,
  name,
}: SelectBranchElementProps) {
  return <Controller
    name={name}
    render={(props) =>
      <BranchField
        workspace={workspace}
        value={props.field.value}
        onChange={props.field.onChange}
      />}
  />
}