import { Avatar, Tooltip } from "@mui/material";
import { blue } from "@mui/material/colors";

export interface EmployeeAvatarProps {
  name?: string
  size?: 'medium' | 'large'
  selected?: boolean
  onClick?: () => void
}

export function EmployeeAvatar({ name, size = 'medium', selected, onClick }: EmployeeAvatarProps) {
  const sizeValue = size === 'large' ? 32 : 24
  return (
    <Tooltip title={name || 'Unassigned'} placement="left">
      <Avatar
        sx={{
          width: sizeValue,
          height: sizeValue,
          cursor: onClick ? 'pointer' : 'default',
          border: selected ? `2px solid ${blue[500]} !important` : null
        }}
        onClick={onClick}
      >
        {name?.[0].toUpperCase()}
      </Avatar>
    </Tooltip>
  )
}