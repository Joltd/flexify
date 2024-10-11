import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import RemoveIcon from '@mui/icons-material/Remove';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { colors } from "@/lib/common/colors";

export interface PriorityBadgeProps {
  priority?: number;
}

const icons = [
  <RadioButtonUncheckedIcon sx={{ color: colors.gray }} />,
  <KeyboardDoubleArrowUpIcon sx={{ color: colors.red }} />,
  <KeyboardArrowUpIcon sx={{ color: colors.red }} />,
  <RemoveIcon sx={{ color: colors.orange }} />,
  <KeyboardArrowDownIcon sx={{ color: colors.blue}} />,
  <KeyboardDoubleArrowDownIcon sx={{ color: colors.blue }} />,
]

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  return icons[priority || 0] || icons[0];
}