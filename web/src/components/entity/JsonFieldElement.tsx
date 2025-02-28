import { Controller } from "react-hook-form";
import { JsonField } from "@/components/entity/JsonField";

export interface JsonFieldElementProps {
  name: string
  label: string
}

export function JsonFieldElement({ name, label }: JsonFieldElementProps) {
  return <Controller
    name={name}
    render={(props) =>
      <JsonField
        label={label}
        value={props.field.value}
        onChange={props.field.onChange}
      />}
  />
}