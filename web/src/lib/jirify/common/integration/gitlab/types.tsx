import { MergeRequestStatusEnum } from "@/lib/jirify/common/types";

export const getMergeRequestStatus = (externalStatus?: string): MergeRequestStatusEnum => {
  switch (externalStatus) {
    case 'preparing':
    case 'checking':
      return MergeRequestStatusEnum.WAITING
    case 'mergeable':
      return MergeRequestStatusEnum.READY
    default:
      return MergeRequestStatusEnum.ERROR
  }
}