import { useApi } from "@/lib/common/api";
import { API_URL } from "@/lib/urls";
import { ChangeEvent, SyntheticEvent, useEffect, useState } from "react";
import {
  Autocomplete,
  IconButton, Stack,
  TextField,
} from "@mui/material";
import { SelectBranch } from "@/lib/jirify/types";
import LinkIcon from '@mui/icons-material/Link';
import CloseIcon from '@mui/icons-material/Close';
import { Add } from "@mui/icons-material";

export interface BranchFieldProps {
  workspace: string
  repository: string
  nameSuggestion?: string
  label?: string
  value: CreateBranch | string | null
  onChange: (value: CreateBranch | string | null) => void
}

export interface CreateBranch {
  name: string
  parent?: string
}

enum Mode {
  CREATE = 'CREATE',
  SELECT = 'SELECT',
}

export function BranchField({
  workspace,
  repository,
  nameSuggestion,
  label,
  value,
  onChange,
}: BranchFieldProps) {
  const branchApi = useApi<SelectBranch[]>(API_URL.jirify.common.branch.select, [])
  const [mode, setMode] = useState<Mode>(Mode.SELECT)
  const [branch, setBranch] = useState<SelectBranch | null>(null)
  const [name, setName] = useState('')

  useEffect(() => {
    if (!workspace || !repository) {
      return
    }

    branchApi.get({
      queryParams: { workspace, repository }
    })

    if (typeof value === 'string') {
      const branch = branchApi.data
        .find((branch) => branch.id === value) || null
      setBranch(branch)
    }
  }, [workspace, repository])

  const handleCreate = () => {
    setBranch(null)
    setName(nameSuggestion || '')
    setMode(Mode.CREATE)
    if (nameSuggestion) {
      onChange({
        name: nameSuggestion,
        parent: branch?.id
      })
    }
  }

  const handleSelectBranch = (event: SyntheticEvent, value: SelectBranch | null) => {
    setBranch(value)
    onChange(value?.id || null)
  }

  const handleChangeName = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value)
    onChange({
      name: event.target.value,
      parent: branch?.id
    })
  }

  const handleSelectParent = (event: SyntheticEvent, value: SelectBranch | null) => {
    setBranch(value)
    onChange({
      name: name,
      parent: value?.id
    })
  }

  const handleBackToSelect = () => {
    setMode(Mode.SELECT)
    setBranch(null)
  }

  const renderSelectBranch = () => (
    <Autocomplete
      options={branchApi.data}
      renderInput={(props) => (
        <TextField
          label={label || "Branch"}
          {...props}
          InputProps={{
            ...props.InputProps,
            endAdornment: (
              <>
                <IconButton
                  size="small"
                  sx={{padding: '2px'}}
                  onClick={handleCreate}
                >
                  <Add />
                </IconButton>
                {props.InputProps.endAdornment}
              </>
            )
          }}
        />
      )}
      value={branch}
      onChange={handleSelectBranch}
      getOptionLabel={(option) => option.name}
      sx={{ minWidth: 200}}
    />
  )

  const renderCreateBranch = () => (
    <Stack direction="row" gap={1} alignItems="center">
      <TextField
        label="Name"
        value={name}
        onChange={handleChangeName}
        required
      />
      <LinkIcon />
      <Autocomplete
        options={branchApi.data.filter((branch) => !repository || branch.repository === repository)}
        renderInput={(props) => <TextField label="Parent" {...props} />}
        value={branch}
        onChange={handleSelectParent}
        getOptionLabel={(option) => option.name}
        sx={{ minWidth: 200, flexGrow: 1 }}
      />
      <IconButton size="small" onClick={handleBackToSelect}>
        <CloseIcon />
      </IconButton>
    </Stack>
  )

  return (
    <>
      {mode === Mode.SELECT && renderSelectBranch()}
      {mode === Mode.CREATE && renderCreateBranch()}
    </>
  )
}