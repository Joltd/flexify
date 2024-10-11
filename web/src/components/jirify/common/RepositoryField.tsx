import { Autocomplete, TextField } from "@mui/material";
import { useApi } from "@/lib/common/api";
import { SelectRepository } from "@/lib/jirify/types";
import { API_URL } from "@/lib/urls";
import { useEffect, useState } from "react";

export interface RepositoryFieldProps {
  workspace: string;
  value?: string;
  onChange: (value: string | null) => void;
}

export function RepositoryField({
  workspace,
  value,
  onChange,
}: RepositoryFieldProps) {
  const repositoryApi = useApi<SelectRepository[]>(API_URL.jirify.common.repository.select, [])
  const [repository, setRepository] = useState<SelectRepository | null>(null)

  useEffect(() => {
    repositoryApi.get({
      queryParams: { workspace }
    })
  }, []);

  useEffect(() => {
    const repository = repositoryApi.data
      .find((repository) => repository.id === value) || null
    setRepository(repository)
  }, [repositoryApi.data]);

  const handleSelect = (event: any, value: SelectRepository | null) => {
    setRepository(value)
    onChange(value?.id || null)
  }

  return <Autocomplete
    options={repositoryApi.data}
    renderInput={(props) => <TextField label="Repository" {...props} />}
    value={repository}
    onChange={handleSelect}
    getOptionLabel={(option) => option.name}
  />
}