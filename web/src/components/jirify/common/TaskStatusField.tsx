import { TaskStatusEnum, TaskStatusLabel } from "@/lib/jirify/common/types";
import { Autocomplete, Button, Stack, TextField } from "@mui/material";

export interface TaskStatusFieldProps {
  label?: string
  status: TaskStatusEnum | null
  onChange: (status: TaskStatusEnum | null) => void
}

const suggestions = {
  [TaskStatusEnum.UNKNOWN]: [],
  [TaskStatusEnum.TODO]: [TaskStatusEnum.IN_PROGRESS, TaskStatusEnum.REVIEW, TaskStatusEnum.TESTING],
  [TaskStatusEnum.IN_PROGRESS]: [TaskStatusEnum.TODO, TaskStatusEnum.REVIEW, TaskStatusEnum.TESTING],
  [TaskStatusEnum.REVIEW]: [TaskStatusEnum.TODO, TaskStatusEnum.IN_PROGRESS, TaskStatusEnum.TESTING],
  [TaskStatusEnum.DEPLOY]: [TaskStatusEnum.IN_PROGRESS, TaskStatusEnum.REVIEW, TaskStatusEnum.TESTING],
  [TaskStatusEnum.TESTING]: [],
  [TaskStatusEnum.READY_TO_PROD]: [],
  [TaskStatusEnum.DONE]: [],
  [TaskStatusEnum.CANCELLED]: [],
  [TaskStatusEnum.ON_HOLD]: [],
}

export function TaskStatusField({
  label = 'Status',
  status,
  onChange,
}: TaskStatusFieldProps) {
  return (
    <Stack gap={1}>
      <Autocomplete
        options={Object.values(TaskStatusEnum)}
        getOptionLabel={(option) => TaskStatusLabel[option]}
        renderInput={(props) => <TextField label={label} {...props} />}
        value={status}
        onChange={(_, value) => onChange(value)}
      />
      {status && suggestions[status]?.length > 0 && (
        <Stack direction="row" gap={1}>
          {suggestions[status]?.map((suggestionStatus) => (
            <Button key={suggestionStatus} size="small" onClick={() => onChange(suggestionStatus)}>
              {TaskStatusLabel[suggestionStatus]}
            </Button>
          ))}
        </Stack>
      )}
    </Stack>
  )
}