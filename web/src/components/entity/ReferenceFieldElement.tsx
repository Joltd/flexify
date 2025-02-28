import { Controller } from "react-hook-form";
import { ReferenceField } from "@/components/entity/ReferenceField";

export interface ReferenceFieldElementProps {
  name: string
  label?: string
  entity: string
  multiple?: boolean
}

export function ReferenceFieldElement({ name, label, entity, multiple }: ReferenceFieldElementProps) {
  return <Controller
    name={name}
    render={(props) =>
      <ReferenceField
        label={label}
        entity={entity}
        multiple={multiple}
        value={props.field.value}
        onChange={props.field.onChange}
      />}
  />
}
