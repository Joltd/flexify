import { createUseFetchStore } from "@/lib/common/store/fetch-store";
import { SquadAppWorkspaceData } from "@/lib/jirify/squad-app/store/type";
import { squadAppUrls } from "@/lib/jirify/squad-app/urls";

export const useSquadAppStore = createUseFetchStore<SquadAppWorkspaceData>('GET', squadAppUrls.root)