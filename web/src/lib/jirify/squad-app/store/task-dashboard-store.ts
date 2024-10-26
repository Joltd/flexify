import { create } from "zustand/index";
import { createFetchStore, FetchStoreState } from "@/lib/common/store/fetch-store";
import { TaskDashboardData } from "@/lib/jirify/squad-app/store/type";
import { squadAppUrls } from "@/lib/jirify/squad-app/urls";
import { DevelopmentArea } from "@/lib/jirify/common/types";
import { observable } from "@/lib/common/store/store";

interface TaskDashboardStoreState {
  employees: string[]
  setEmployees: (employees: string[]) => void
  areas: DevelopmentArea[]
  setAreas: (areas: DevelopmentArea[]) => void
  performed: boolean
  setPerformed: (performed: boolean) => void
  search: string
  setSearch: (search: string) => void
  task: string | null
  setTask: (task: string | null) => void
  dashboard: FetchStoreState<TaskDashboardData>
}

export const useTaskDashboardStore = create<TaskDashboardStoreState>()((set) => {
  const dashboard = createFetchStore<TaskDashboardData>('GET', squadAppUrls.taskDashboard.root, { keepData: true })

  const setEmployees = (employees: string[]) => {
    set({ employees })
    dashboard.getState().updateQueryParams({ employees })
    dashboard.getState().fetch()
  }

  const setAreas = (areas: DevelopmentArea[]) => {
    set({ areas })
    dashboard.getState().updateQueryParams({ areas })
    dashboard.getState().fetch()
  }

  const setPerformed = (performed: boolean) => {
    set({ performed })
    dashboard.getState().updateQueryParams({ performed })
    dashboard.getState().fetch()
  }

  return {
    employees: [],
    setEmployees,
    areas: [],
    setAreas,
    performed: false,
    setPerformed,
    search: '',
    setSearch: (search) => set({ search }),
    task: null,
    setTask: (task) => set({ task }),
    dashboard: observable(dashboard, set, 'dashboard')
  }
})