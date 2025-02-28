import { ValueEditorProps } from "react-querybuilder";
import { EntityFieldKind, EntityFieldOperator, ReferenceValue } from "@/lib/entity/types";
import { MenuItem, Select, TextField } from "@mui/material";
import { EnumField } from "@/components/entity/EnumField";
import { ReferenceField } from "@/components/entity/ReferenceField";

export function FilterValueEditor(props: ValueEditorProps) {
  // todo clear on change operator or field

  if (props.operator === EntityFieldOperator.IS_NULL) {
    return <></>
  }

  if (props.fieldData.kind === EntityFieldKind.ENUM) {
    return <EnumField
      options={(props.fieldData.values as unknown) as string[]}
      value={props.value}
      onChange={value => props.handleOnChange(value)}
      multiple
      size="small"
      variant="standard"
      className="rule-value"
    />
  }

  if (props.fieldData.kind === EntityFieldKind.REFERENCE) {
    return <ReferenceField
      entity={props.fieldData.entity as string}
      value={props.value as ReferenceValue}
      onChange={value => props.handleOnChange(value)}
      multiple
      size="small"
      variant="standard"
      className="rule-value"
    />
  }

  if (props.fieldData.kind === EntityFieldKind.BOOLEAN) {
    return <Select
      size="small"
      variant="standard"
      value={props.value}
      onChange={(event) => props.handleOnChange(event.target.value as boolean)}
      className="rule-value"
    >
      <MenuItem value="false">No</MenuItem>
      <MenuItem value="true">Yes</MenuItem>
    </Select>
  }

  if (props.fieldData.kind === EntityFieldKind.DATE || props.fieldData.kind === EntityFieldKind.DATETIME) {
    return <></>
  }

  return <TextField
    size="small"
    variant="standard"
    value={props.value}
    onChange={(event) => props.handleOnChange(event.target.value)}
    className="rule-value"
  />
}