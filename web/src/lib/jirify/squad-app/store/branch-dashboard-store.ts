import { createFetchStore, FetchStoreState } from "@/lib/common/store/fetch-store";
import { BranchDashboardBranchData, BranchDashboardEntry } from "@/lib/jirify/squad-app/store/type";
import { create } from "zustand/index";
import { observable } from "@/lib/common/store/store";
import { squadAppUrls } from "@/lib/jirify/squad-app/urls";
import { DevelopmentArea } from "@/lib/jirify/common/types";

interface BranchDashboardStoreState {
  area: DevelopmentArea
  setArea: (repository: DevelopmentArea) => void
  readyToProd: boolean
  setReadyToProd: (readyToProd: boolean) => void
  hidden: boolean
  setHidden: (hidden: boolean) => void
  search: string
  setSearch: (search: string) => void
  dashboard: FetchStoreState<BranchDashboardEntry[]>
  branchId: string | null
  setBranchId: (branch: string | null) => void
  branch: FetchStoreState<BranchDashboardBranchData>
  mode: BranchDashboardModeEnum | null
  setMode: (mode: BranchDashboardModeEnum | null) => void
}

export enum BranchDashboardModeEnum {
  VIEW = 'VIEW',
  CREATE = 'CREATE',
  RELATION = 'RELATION',
  MERGE_REQUEST = 'MERGE_REQUEST',
}

export const useBranchDashboardStore = create<BranchDashboardStoreState>((set) => {
  const dashboard = createFetchStore<BranchDashboardEntry[]>('GET', squadAppUrls.branchDashboard.root, { keepData: true })
  const branch = createFetchStore<BranchDashboardBranchData>('GET', squadAppUrls.branchDashboard.branchId)

  const setFilter = (filter: Partial<BranchDashboardStoreState>) => {
    set({ ...filter })
    dashboard.getState().updateQueryParams({ ...filter })
    dashboard.getState().fetch()
  }

  return {
    area: DevelopmentArea.BACKEND,
    setArea: (area) => setFilter({ area }),
    readyToProd: false,
    setReadyToProd: (readyToProd) => setFilter({ readyToProd }),
    hidden: false,
    setHidden: (hidden) => setFilter({ hidden }),
    search: '',
    setSearch: (search) => set({ search }),
    dashboard: observable(dashboard, set, 'dashboard'),
    branchId: null,
    setBranchId: (branchId) => set({ branchId }),
    branch: observable(branch, set, 'branch'),
    mode: null,
    setMode: (mode) => set({ mode }),
  }
})