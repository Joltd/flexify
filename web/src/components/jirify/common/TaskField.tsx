import { useEffect } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { useFetchStore } from "@/lib/common/store/fetch-store";
import { FieldRecord } from "@/lib/common/store/store";
import { jirifyUrls } from "@/lib/jirify/common/urls";

export interface TaskFieldProps {
  workspace: string
  value?: string
  onChange: (value: string | null) => void
  label?: string
}

export function TaskField({
  workspace,
  value,
  onChange,
  label,
}: TaskFieldProps) {
  const store = useFetchStore<FieldRecord[]>('GET', jirifyUrls.task.field)

  useEffect(() => {
    if (workspace) {
      store.fetch({ queryParams: { workspace } })
    }
  }, [workspace])

  const handleSelect = (event: any, value: FieldRecord | null) => {
    onChange(value?.id || null)
  };

  return <Autocomplete
    options={store.data || []}
    renderInput={(props) => <TextField label={label || "Task"} {...props} />}
    value={store.data?.find((task) => task.id === value) || null}
    onChange={handleSelect}
    getOptionLabel={(option) => option.label}
  />
}