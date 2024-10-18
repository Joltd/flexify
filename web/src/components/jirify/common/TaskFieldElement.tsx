import { Controller } from "react-hook-form";
import { TaskField } from "@/components/jirify/common/TaskField";

export interface TaskFieldElementProps {
  workspace: string
  name: string
}

export function TaskFieldElement({
  workspace,
  name,
}: TaskFieldElementProps) {
  return <Controller
    name={name}
    render={(props) =>
      <TaskField
        workspace={workspace}
        value={props.field.value}
        onChange={props.field.onChange}
      />}
  />
}