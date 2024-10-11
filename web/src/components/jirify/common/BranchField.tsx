import { useApi } from "@/lib/common/api";
import { API_URL } from "@/lib/urls";
import { ChangeEvent, SyntheticEvent, useEffect, useState } from "react";
import { Autocomplete, Button, IconButton, Skeleton, Stack, TextField, Typography } from "@mui/material";
import { SelectBranch, SelectRepository } from "@/lib/jirify/types";
import LinkIcon from '@mui/icons-material/Link';
import CloseIcon from '@mui/icons-material/Close';

export interface BranchFieldProps {
  workspace: string;
  defaultRepository?: string;
  value?: BranchValue | null;
  onChange: (value: BranchValue | null) => void;
}

export interface BranchValue {
  id?: string;
  create?: {
    name: string;
    parent?: string;
    repository: string;
  }
}

enum Phase {
  BEGIN = 'BEGIN',
  REPOSITORY = 'REPOSITORY',
  BRANCH = 'BRANCH',
}

enum Mode {
  CREATE = 'CREATE',
  SELECT = 'SELECT',
}

export function BranchField({
  workspace,
  defaultRepository,
  value,
  onChange,
}: BranchFieldProps) {
  const repositoryApi = useApi<SelectRepository[]>(API_URL.jirify.common.repository.select, [])
  const branchApi = useApi<SelectBranch[]>(API_URL.jirify.common.branch.select, [])
  const [phase, setPhase] = useState(Phase.BEGIN)
  const [mode, setMode] = useState<Mode | null>(null)
  const [repository, setRepository] = useState<SelectRepository | null>(null)
  const [branch, setBranch] = useState<SelectBranch | null>(null)
  const [name, setName] = useState('')

  useEffect(() => {
    if (workspace) {
      repositoryApi.get({
        queryParams: { workspace }
      })
      branchApi.get({
        queryParams: { workspace }
      })
    }
  }, [workspace]);

  useEffect(() => {
    if (repositoryApi.data.length === 0 || branchApi.data.length === 0) {
      return;
    }

    if (value?.id) {

      const branch = branchApi.data
        .find((branch) => branch.id === value.id) || null
      setBranch(branch)

      const repository = repositoryApi.data
        .find((repository) => repository.id === branch?.repository) || null
      setRepository(repository)

      setMode(Mode.SELECT)
      setPhase(Phase.BRANCH)

    } else if (value?.create) {

      setName(value.create.name)

      const repository = repositoryApi.data
        .find((repository) => repository.id === value.create?.repository) || null
      setRepository(repository)

      const branch = branchApi.data
        .find((branch) => branch.id === value.create?.parent) || null
      setBranch(branch)

      setMode(Mode.CREATE)
      setPhase(Phase.BRANCH)

    }
  }, [repositoryApi.data, branchApi.data]);

  const handleCreate = () => {
    setMode(Mode.CREATE)
    setPhase(Phase.REPOSITORY)
  }

  const handleSelect = () => {
    setMode(Mode.SELECT)
    setPhase(Phase.REPOSITORY)
  }

  const handleSelectRepository = (repository: SelectRepository) => {
    setRepository(repository)
    setPhase(Phase.BRANCH)
  }

  const handleSelectBranch = (event: SyntheticEvent, value: SelectBranch | null) => {
    setBranch(value)
    onChange({
      id: value?.id
    })
  }

  const handleChangeName = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value)
    onChange({
      create: {
        name: event.target.value,
        parent: branch?.id,
        repository: repository?.id || ''
      }
    })
  }

  const handleSelectParent = (event: SyntheticEvent, value: SelectBranch | null) => {
    setBranch(value)
    onChange({
      create: {
        name,
        parent: value?.id || '',
        repository: repository?.id || ''
      }
    })
  }

  const handleClear = () => {
    setRepository(null)
    setBranch(null)
    setMode(null)
    setPhase(Phase.BEGIN)
    onChange(null)
  }

  const renderBegin = () => (
    <>
      <Button
        variant="contained"
        onClick={handleSelect}
      >
        Select
      </Button>
      <Button
        variant="contained"
        onClick={handleCreate}
      >
        Create
      </Button>
    </>
  )

  const renderSelectRepository = () => (
    <>
      {repositoryApi.data.map((repository, index) => (
        <Button
          key={index}
          color="inherit"
          onClick={() => handleSelectRepository(repository)}
        >
          {repository.name}
        </Button>
      ))}
      <IconButton size="small" onClick={handleClear}>
        <CloseIcon />
      </IconButton>
    </>
  )

  const renderSelectBranch = () => (
    <>
      <Button
        color="inherit"
        onClick={handleSelect}
      >
        {repository?.name}
      </Button>
      <Typography paddingRight={1}>/</Typography>
      <Autocomplete
        options={branchApi.data.filter((branch) => !repository || branch.repository === repository?.id)}
        renderInput={(props) => <TextField label="Branch" {...props} />}
        value={branch}
        onChange={handleSelectBranch}
        getOptionLabel={(option) => option.name}
        sx={{ minWidth: 200}}
      />
      <IconButton size="small" onClick={handleClear}>
        <CloseIcon />
      </IconButton>
    </>
  )

  const renderCreateBranch = () => (
    <>
      <Button
        color="inherit"
        onClick={handleCreate}
      >
        {repository?.name}
      </Button>
      <Typography paddingRight={1}>/</Typography>
      <TextField
        label="Name"
        value={name}
        onChange={handleChangeName}
        required
      />
      <LinkIcon />
      <Autocomplete
        options={branchApi.data.filter((branch) => !repository || branch.repository === repository?.id)}
        renderInput={(props) => <TextField label="Parent" {...props} />}
        value={branch}
        onChange={handleSelectParent}
        getOptionLabel={(option) => option.name}
        sx={{ minWidth: 200}}
      />
      <IconButton
        size="small"
        onClick={handleClear}
      >
        <CloseIcon />
      </IconButton>
    </>
  )

  return <Stack minHeight={56} direction="row" gap={1} alignItems="center">
    {(repositoryApi.loading || branchApi.loading) && <Skeleton height="48px" width="100%"/>}
    {phase === Phase.BEGIN && renderBegin()}
    {phase === Phase.REPOSITORY && renderSelectRepository()}
    {phase === Phase.BRANCH && mode === Mode.SELECT && renderSelectBranch()}
    {phase === Phase.BRANCH && mode === Mode.CREATE && renderCreateBranch()}
  </Stack>
}