import { ChangeEvent, SyntheticEvent, useEffect, useState } from "react";
import {
  Autocomplete,
  IconButton, Stack,
  TextField,
} from "@mui/material";
import LinkIcon from '@mui/icons-material/Link';
import CloseIcon from '@mui/icons-material/Close';
import { Add } from "@mui/icons-material";
import { useFetchStore } from "@/lib/common/store/fetch-store";
import { jirifyUrls } from "@/lib/jirify/common/urls";
import { FieldRecord } from "@/lib/common/store/store";

export interface BranchFieldProps {
  workspace: string
  repository: string
  nameSuggestion?: string
  label?: string
  value: CreateBranch | string | null
  onChange: (value: CreateBranch | string | null) => void
  base?: boolean
  common?: boolean
  hidden?: boolean
  withAdd?: boolean
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
  base,
  common,
  hidden,
  withAdd,
}: BranchFieldProps) {
  const store = useFetchStore<FieldRecord[]>('GET', jirifyUrls.branch.field)
  const [mode, setMode] = useState<Mode>(Mode.SELECT)
  const [branch, setBranch] = useState<FieldRecord | null>(null)
  const [name, setName] = useState('')

  useEffect(() => {
    if (!workspace || !repository) {
      return
    }

    store.fetch({
      queryParams: { workspace, repository, base, common, hidden }
    })
  }, [workspace, repository, base, common, hidden])

  useEffect(() => {
    if (store.data && typeof value === 'string') {
      const branch = store.data.find((branch) => branch.id === value) || null
      setBranch(branch)
    }
  }, [value, store.data]);

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

  const handleSelectBranch = (event: SyntheticEvent, value: FieldRecord | null) => {
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

  const handleSelectParent = (event: SyntheticEvent, value: FieldRecord | null) => {
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
      options={store.data || []}
      renderInput={(props) => (
        <TextField
          label={label || "Branch"}
          {...props}
          InputProps={{
            ...props.InputProps,
            endAdornment: (
              <>
                {withAdd && (
                  <IconButton
                    size="small"
                    sx={{padding: '2px'}}
                    onClick={handleCreate}
                  >
                    <Add />
                  </IconButton>
                )}
                {props.InputProps.endAdornment}
              </>
            )
          }}
        />
      )}
      value={branch}
      onChange={handleSelectBranch}
      getOptionLabel={(option) => option.label}
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
        options={store.data || []}
        renderInput={(props) => <TextField label="Parent" {...props} />}
        value={branch}
        onChange={handleSelectParent}
        getOptionLabel={(option) => option.label}
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