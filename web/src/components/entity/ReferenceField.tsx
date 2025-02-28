import { Autocomplete, CircularProgress, TextField } from "@mui/material";
import { useFetchStore } from "@/lib/common/store/fetch-store";
import { ReferenceValue } from "@/lib/entity/types";
import { entityAppUrls } from "@/lib/entity/urls";
import { useEffect } from "react";
import * as changeCase from "change-case";
import { TextFieldVariants } from "@mui/material/TextField/TextField";

export interface ReferenceFieldProps {
  entity: string
  multiple?: boolean
  value?: null | ReferenceValue | ReferenceValue[]
  onChange?: (value: ReferenceValue | ReferenceValue[]) => void
  size?: 'small' | 'medium'
  variant?: TextFieldVariants
  label?: string
  className?: string
}

export function ReferenceField({ entity, multiple, value = null, onChange, size, variant, label, className }: ReferenceFieldProps) {
  const store = useFetchStore<ReferenceValue[]>('GET', entityAppUrls.reference)

  useEffect(() => {
    if (entity) {
      store.updatePathParams({ entity: changeCase.kebabCase(entity) })
    }
  }, [entity])

  const handleChange = (event: any, value: any) => {
    onChange?.(value)
  }

  const handleInput = (event: any, value: string) => {
    if (!event) {
      return
    }
    store.updateQueryParams({ search: value })
    store.fetch()
  }

  return <Autocomplete
    multiple={multiple}
    options={store.data || []}
    renderInput={(props) =>
      <TextField
        variant={variant}
        label={label}
        {...props}
        slotProps={{
          input: {
            ...props.InputProps,
            endAdornment: <>
              {store.loading && <CircularProgress size={20} />}
              {props.InputProps.endAdornment}
            </>
          }
        }}
      />}
    value={value}
    onChange={handleChange}
    onInputChange={handleInput}
    onOpen={() => store.fetch()}
    filterOptions={(options) => options}
    size={size}
    className={className}
  />
}
