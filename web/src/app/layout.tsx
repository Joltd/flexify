import { Theme } from "@/components/common/Theme";
import { ReactNode } from "react";
import './global.css';
import { Notifications } from "@/components/common/Notifications";

export const metadata = {
  title: 'Flexify',
}

export interface RootLayoutProps {
  children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <Theme>
          {children}
          <Notifications />
        </Theme>
      </body>
    </html>
  )
}
