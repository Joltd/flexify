'use client'
import { Drawer, Grid2 } from "@mui/material";
import { TaskDashboardList } from "@/fragments/jirify/squad-app/task-dashboard/TaskDashboardList";
import { TaskDashboardToolbar } from "@/fragments/jirify/squad-app/task-dashboard/TaskDashboardToolbar";
import { TaskDashboardView } from "@/fragments/jirify/squad-app/task-dashboard/TaskDashboardView";
import { useEffect } from "react";
import { useSquadAppStore } from "@/lib/jirify/squad-app/store/squad-app-store";
import { useTaskDashboardStore } from "@/lib/jirify/squad-app/store/task-dashboard-store";
import { BranchDashboardModeEnum, useBranchDashboardStore } from "@/lib/jirify/squad-app/store/branch-dashboard-store";
import { BranchDashboardView } from "@/fragments/jirify/squad-app/branch-dashboard/BranchDashboardView";
import { BranchDashboardRelation } from "@/fragments/jirify/squad-app/branch-dashboard/BranchDashboardRelation";
import { BranchDashboardMergeRequest } from "@/fragments/jirify/squad-app/branch-dashboard/BranchDashboardMergeRequest";

export interface TaskDashboardProps {}

export function TaskDashboard({}: TaskDashboardProps) {
  const squadAppStore = useSquadAppStore()
  const { dashboard, task, setTask } = useTaskDashboardStore()
  const { branchId, setBranchId, mode, setMode } = useBranchDashboardStore()

  useEffect(() => {
    squadAppStore.fetch()
    dashboard.fetch()
  }, []);

  const handleCloseDrawer = () => {
    setTask(null)
    setBranchId(null)
    setMode(null)
  }

  const handleBackToTask = () => {
    setBranchId(null)
    setMode(null)
  }

  return (
    <>
      <Grid2 container margin={4} spacing={2}>
        <TaskDashboardToolbar />
        <TaskDashboardList />
      </Grid2>
      <Drawer
        anchor="right"
        open={task != null || branchId != null}
        onClose={handleCloseDrawer}
      >
        {branchId ? (
          <>
            {mode === BranchDashboardModeEnum.VIEW && <BranchDashboardView onBack={handleBackToTask} />}
            {mode === BranchDashboardModeEnum.RELATION && <BranchDashboardRelation />}
            {mode === BranchDashboardModeEnum.MERGE_REQUEST && <BranchDashboardMergeRequest />}
          </>
        ) : task ? (
          <TaskDashboardView />
        ) : null}
      </Drawer>
    </>
  )
}