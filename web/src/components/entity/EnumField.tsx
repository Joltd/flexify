import { Autocomplete, TextField } from "@mui/material";
import { TextFieldVariants } from "@mui/material/TextField/TextField";

export interface EnumFieldProps {
  options: string[]
  multiple?: boolean
  value?: null | string | string[]
  onChange: (value: string | string[]) => void
  size?: 'small' | 'medium'
  variant?: TextFieldVariants
  label?: string
  className?: string
}

export function EnumField({ options, multiple, value = null, onChange, size, variant, label, className }: EnumFieldProps) {

  const actualValue = value ? value : multiple ? [] : null

  const handleChange = (event: any, value: any) => {
    onChange?.(value)
  }

  return <Autocomplete
    multiple={multiple}
    options={options}
    renderInput={(props) => <TextField variant={variant} label={label} {...props} />}
    value={actualValue}
    onChange={handleChange}
    size={size}
    className={className}
  />
}
