import { Controller } from "react-hook-form";
import { TaskStatusField } from "@/components/jirify/common/TaskStatusField";

export interface TaskStatusFieldElementProps {
  name: string
  label?: string
}

export function TaskStatusFieldElement({ name, label }: TaskStatusFieldElementProps) {
  return (
    <Controller
      name={name}
      render={(props) =>
        <TaskStatusField
          label={label}
          status={props.field.value}
          onChange={props.field.onChange}
        />
      }
    />
  )
}