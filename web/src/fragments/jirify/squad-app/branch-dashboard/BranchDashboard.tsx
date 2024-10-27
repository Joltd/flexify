'use client';
import { Drawer, Grid2 } from "@mui/material";
import { BranchDashboardList } from "@/fragments/jirify/squad-app/branch-dashboard/BranchDashboardList";
import { BranchDashboardToolbar } from "@/fragments/jirify/squad-app/branch-dashboard/BranchDashboardToolbar";
import { useSquadAppStore } from "@/lib/jirify/squad-app/store/squad-app-store";
import { BranchDashboardModeEnum, useBranchDashboardStore } from "@/lib/jirify/squad-app/store/branch-dashboard-store";
import { useEffect } from "react";
import { BranchDashboardView } from "@/fragments/jirify/squad-app/branch-dashboard/BranchDashboardView";
import { BranchDashboardCreate } from "@/fragments/jirify/squad-app/branch-dashboard/BranchDashboardCreate";
import { BranchDashboardRelation } from "@/fragments/jirify/squad-app/branch-dashboard/BranchDashboardRelation";
import { DevelopmentArea } from "@/lib/jirify/common/types";
import { useSearchParams } from "next/navigation";
import { BranchDashboardMergeRequest } from "@/fragments/jirify/squad-app/branch-dashboard/BranchDashboardMergeRequest";

export interface BranchDashboardProps {}

export function BranchDashboard({}: BranchDashboardProps) {
  const squadAppStore = useSquadAppStore()
  const { setArea, branchId, setBranchId, branch, dashboard, mode, setMode } = useBranchDashboardStore()
  const queryParams = useSearchParams()

  useEffect(() => {
    squadAppStore.fetch()
    setArea(DevelopmentArea.BACKEND)
    dashboard.fetch()
  }, []);

  useEffect(() => {
    const id = queryParams.get('id')
    if (id) {
      setBranchId(id)
      branch.updatePathParams({ id })
      branch.fetch()
      setMode(BranchDashboardModeEnum.RELATION)
    }
  }, [queryParams]);

  useEffect(() => {
    if (branchId) {
      branch.updatePathParams({ id: branchId })
      branch.fetch()
    }
  }, [branchId]);

  return (
    <>
      <Grid2 container margin={4} spacing={2}>
        <BranchDashboardToolbar />
        <BranchDashboardList />
      </Grid2>
      <Drawer
        anchor="right"
        open={mode != null}
        onClose={() => setMode(null)}
      >
        {mode === BranchDashboardModeEnum.VIEW && branchId && <BranchDashboardView />}
        {mode === BranchDashboardModeEnum.CREATE && <BranchDashboardCreate />}
        {mode === BranchDashboardModeEnum.RELATION && branchId && <BranchDashboardRelation />}
        {mode === BranchDashboardModeEnum.MERGE_REQUEST && branchId && <BranchDashboardMergeRequest />}
      </Drawer>
    </>
  )
}