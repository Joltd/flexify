import { ReactNode } from "react";
import { ApplicationBar } from "@/components/common/ApplicationBar";

export interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {

  const navigationItems = [
    {
      title: "Issues",
      url: "/jirify/squad-app",
    },
    {
      title: "Branches",
      url: "/jirify/squad-app/branches",
    }
  ]

  return <>
    <ApplicationBar navigationItems={navigationItems} />
    {children}
  </>
}