import { create } from "zustand/index";
import { createFetchStore, FetchStoreState } from "@/lib/common/store/fetch-store";
import { TaskDashboardData } from "@/lib/jirify/squad-app/store/type";
import { squadAppUrls } from "@/lib/jirify/squad-app/urls";
import { DevelopmentArea } from "@/lib/jirify/common/types";
import { observable } from "@/lib/common/store/store";
import { localStorageApi } from "@/lib/common/local-storage";

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
  const localStorage = localStorageApi('taskDashboardFilter')
  dashboard.getState().updateQueryParams(localStorage.data)

  const setFilter = (filter: Partial<TaskDashboardStoreState>) => {
    set({ ...filter })
    dashboard.getState().updateQueryParams({ ...filter })
    dashboard.getState().fetch()
    localStorage.update({ ...filter })
  }

  return {
    employees: [],
    setEmployees: (employees) => setFilter({ employees }),
    areas: [],
    setAreas: (areas) => setFilter({ areas }),
    performed: false,
    setPerformed: (performed) => setFilter({ performed }),
    ...localStorage.data,
    search: '',
    setSearch: (search) => set({ search }),
    task: null,
    setTask: (task) => set({ task }),
    dashboard: observable(dashboard, set, 'dashboard')
  }
})