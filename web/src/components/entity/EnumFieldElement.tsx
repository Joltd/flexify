import { Controller } from "react-hook-form";
import { EnumField } from "@/components/entity/EnumField";

export interface EnumFieldElementProps {
  name: string
  label?: string
  options: string[]
  multiple?: boolean
}

export function EnumFieldElement({ name, label, options, multiple }: EnumFieldElementProps) {
  return <Controller
    name={name}
    render={(props) =>
      <EnumField
        label={label}
        options={options}
        multiple={multiple}
        value={props.field.value}
        onChange={props.field.onChange}
      />}
  />
}
