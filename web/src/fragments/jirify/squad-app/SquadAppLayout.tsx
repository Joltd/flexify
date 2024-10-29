import { ApplicationBar } from "@/components/common/ApplicationBar";

export function SquadAppLayout() {
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

  return (
    <ApplicationBar navigationItems={navigationItems} />
  )
}