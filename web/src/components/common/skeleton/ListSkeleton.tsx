import { Skeleton, Stack } from "@mui/material";

export interface ListSkeletonProps {
  itemHeight?: number
}

export function ListSkeleton({ itemHeight = 48 }: ListSkeletonProps) {
  return <Stack>
    <Skeleton height={itemHeight} />
    <Skeleton height={itemHeight} />
    <Skeleton height={itemHeight} />
  </Stack>
}