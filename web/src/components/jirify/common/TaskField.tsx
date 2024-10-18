import { SelectTask } from "@/lib/jirify/types";
import { API_URL } from "@/lib/urls";
import { useApi } from "@/lib/common/api";
import { useEffect, useState } from "react";
import { Autocomplete, TextField } from "@mui/material";

export interface TaskFieldProps {
  workspace: string
  value?: string
  onChange: (value: string | null) => void
}

export function TaskField({
  workspace,
  value,
  onChange,
}: TaskFieldProps) {
  const taskApi = useApi<SelectTask[]>(API_URL.jirify.common.task.select, [])
  const [task, setTask] = useState<SelectTask | null>(null)

  useEffect(() => {
    taskApi.get({
      queryParams: { workspace }
    })
  }, [])

  useEffect(() => {
    const task = taskApi.data
      .find((task) => task.id === value) || null
    setTask(task)
  }, [taskApi.data]);

  const handleSelect = (event: any, value: SelectTask | null) => {
    setTask(value)
    onChange(value?.id || null)
  };

  return <Autocomplete
    options={taskApi.data}
    renderInput={(props) => <TextField label="Task" {...props} />}
    value={task}
    onChange={handleSelect}
    getOptionLabel={(option) => `${option.key} - ${option.summary}`}
  />
}