import { EmployeeField } from "@/components/jirify/common/EmployeeField";
import { Controller } from "react-hook-form";

export interface EmployeeFieldElementProps {
  workspace: string;
  name: string;
}

export function EmployeeFieldElement({
  workspace,
  name,
}: EmployeeFieldElementProps) {
  return <Controller
    name={name}
    render={(props) =>
      <EmployeeField
        workspace={workspace}
        value={props.field.value}
        onChange={props.field.onChange}
      />}
  />
}