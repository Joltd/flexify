import { Controller } from "react-hook-form";
import { RepositoryField } from "@/components/jirify/common/RepositoryField";

export interface RepositoryFieldElementProps {
  workspace: string
  name: string
  label?: string
}

export function RepositoryFieldElement({
  workspace,
  name,
  label,
}: RepositoryFieldElementProps) {
  return <Controller
    name={name}
    render={(props) =>
      <RepositoryField
        workspace={workspace}
        value={props.field.value}
        onChange={props.field.onChange}
        label={label}
      />}
  />
}