import { BranchDashboard } from "@/fragments/jirify/squad-app/branch-dashboard/BranchDashboard";
import { Suspense } from "react";

export default function Page() {
  return <Suspense>
    <BranchDashboard />
  </Suspense>
}
