import { ReactNode } from "react";
import { SquadAppLayout } from "@/fragments/jirify/squad-app/SquadAppLayout";

export interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return <>
    <SquadAppLayout />
    {children}
  </>
}