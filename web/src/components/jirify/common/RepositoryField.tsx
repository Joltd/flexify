import { Autocomplete, TextField } from "@mui/material";
import { useEffect } from "react";
import { useFetchStore } from "@/lib/common/store/fetch-store";
import { FieldRecord } from "@/lib/common/store/store";
import { jirifyUrls } from "@/lib/jirify/common/urls";

export interface RepositoryFieldProps {
  workspace: string
  value?: string
  onChange: (value: string | null) => void
  label?: string
}

export function RepositoryField({
  workspace,
  value,
  onChange,
  label,
}: RepositoryFieldProps) {
  const store = useFetchStore<FieldRecord[]>('GET', jirifyUrls.repository.field)

  useEffect(() => {
    if (workspace) {
      store.fetch({ queryParams: { workspace } })
    }
  }, [workspace]);

  const handleSelect = (event: any, value: FieldRecord | null) => {
    onChange(value?.id || null)
  }

  return <Autocomplete
    options={store.data || []}
    renderInput={(props) => <TextField label={label || "Repository"} {...props} />}
    value={store.data?.find((repository) => repository.id === value) || null}
    onChange={handleSelect}
    getOptionLabel={(option) => option.label}
  />
}