'use client'
import { Drawer, Grid2 } from "@mui/material";
import { TaskDashboardList } from "@/fragments/jirify/squad-app/task-dashboard/TaskDashboardList";
import { TaskDashboardToolbar } from "@/fragments/jirify/squad-app/task-dashboard/TaskDashboardToolbar";
import { TaskDashboardView } from "@/fragments/jirify/squad-app/task-dashboard/TaskDashboardView";
import { useEffect } from "react";
import { useSquadAppStore } from "@/lib/jirify/squad-app/store/squad-app-store";
import { useTaskDashboardStore } from "@/lib/jirify/squad-app/store/task-dashboard-store";

export function TaskDashboard() {
  const squadAppStore = useSquadAppStore()
  const { dashboard, task, setTask } = useTaskDashboardStore()

  useEffect(() => {
    squadAppStore.fetch()
    dashboard.fetch()
  }, []);

  return (
    <>
      <Grid2 container margin={4} spacing={2}>
        <TaskDashboardToolbar />
        <TaskDashboardList />
      </Grid2>
      <Drawer
        anchor="right"
        open={task != null}
        onClose={() => setTask(null)}
      >
        {task && <TaskDashboardView />}
      </Drawer>
    </>
  )
}