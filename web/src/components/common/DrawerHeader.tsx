import { Button, Stack, Typography } from "@mui/material";

export interface DrawerHeaderProps {
  title: string
  action?: string
  onAction?: () => void
  secondAction?: string
  onSecondAction?: () => void
}

export function DrawerHeader({ title, action, onAction, secondAction, onSecondAction }: DrawerHeaderProps) {
  return <Stack direction="row" spacing={1}>
    <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>{title}</Typography>
    {secondAction && onSecondAction &&
      <Button variant="outlined" onClick={onSecondAction}>
        {secondAction}
      </Button>
    }
    <Button color="primary" variant="contained" type="submit" onClick={onAction}>
      {action || 'Save'}
    </Button>
  </Stack>
}