import { ReactNode } from "react"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Home, Eraser, FileText, Settings, LayoutDashboard, HardDrive, ListChecks, CheckCircle2, PackageCheck } from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  return (
    <div className={cn("flex h-full flex-col overflow-y-auto border-r bg-background p-4", className)}>
      <div className="flex items-center justify-between h-16 shrink-0">
        <h2 className="text-lg font-semibold">WipeApp</h2>
      </div>
      <Separator className="my-4" />
      <nav className="flex flex-col space-y-2">
        <Link href="/welcome">
          <Button variant="ghost" className="w-full justify-start">
            <Home className="mr-2 h-4 w-4" /> Welcome
          </Button>
        </Link>
        <Link href="/dashboard">
          <Button variant="ghost" className="w-full justify-start">
            <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
          </Button>
        </Link>
        <Link href="/device-selection">
          <Button variant="ghost" className="w-full justify-start">
            <HardDrive className="mr-2 h-4 w-4" /> Select Device
          </Button>
        </Link>
        <Link href="/wipe-method">
          <Button variant="ghost" className="w-full justify-start">
            <ListChecks className="mr-2 h-4 w-4" /> Wipe Method
          </Button>
        </Link>
        <Link href="/wipe-progress">
          <Button variant="ghost" className="w-full justify-start">
            <CheckCircle2 className="mr-2 h-4 w-4" /> Wipe Progress
          </Button>
        </Link>
        <Link href="/wipe-complete">
          <Button variant="ghost" className="w-full justify-start">
            <PackageCheck className="mr-2 h-4 w-4" /> Wipe Complete
          </Button>
        </Link>
        <Link href="/erase">
          <Button variant="ghost" className="w-full justify-start">
            <Eraser className="mr-2 h-4 w-4" /> Erase Disk (Pro)
          </Button>
        </Link>
        <Link href="/certificate">
          <Button variant="ghost" className="w-full justify-start">
            <FileText className="mr-2 h-4 w-4" /> Certificate
          </Button>
        </Link>
        <Link href="/settings">
          <Button variant="ghost" className="w-full justify-start">
            <Settings className="mr-2 h-4 w-4" /> Settings
          </Button>
        </Link>
      </nav>
    </div>
  )
}
