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
  <RadioButtonUncheckedIcon key={0} sx={{ color: colors.gray }} />,
  <KeyboardDoubleArrowUpIcon key={1} sx={{ color: colors.red }} />,
  <KeyboardArrowUpIcon key={2} sx={{ color: colors.red }} />,
  <RemoveIcon key={3} sx={{ color: colors.orange }} />,
  <KeyboardArrowDownIcon key={4} sx={{ color: colors.blue}} />,
  <KeyboardDoubleArrowDownIcon key={5} sx={{ color: colors.blue }} />,
]

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  return icons[priority || 0] || icons[0];
}