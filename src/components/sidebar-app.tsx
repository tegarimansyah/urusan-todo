import { Bell, Calendar, Home, Inbox, Search, Settings, User, Timer, Target, Pen } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarHeader,
  SidebarFooter
} from "@/components/ui/sidebar"
import { NavUser } from "@/components/sidebar-user"
import { Link } from "react-router-dom"

// Menu items.
const items = [
  {
    title: "Now",
    url: "/",
    icon: Timer,
  },
  {
    title: "Goals",
    url: "/",
    icon: Target,
  },
  {
    title: "Roles",
    url: "#",
    icon: Inbox,
  },
  {
    title: "Activities",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Tasks",
    url: "#",
    icon: Search,
  },
  {
    title: "To Do",
    url: "#",
    icon: Pen,
  },
]
// TODO add collapsible for finance, etc like this: https://ui.shadcn.com/blocks#sidebar-12

// Mobile-only menu items that appear at the bottom
const mobileItems = [
  {
    title: "Notifications",
    url: "#",
    icon: Bell,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: User,
  },
]

const data = {
  user: {
    name: "Tegar Imansyah",
    email: "tegar@urusan.id",
    avatar: "/avatars/shadcn.jpg",
  }
}

export function AppSidebar() {
  return (
    <Sidebar>
    <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Home className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Urusan.id</span>
                  <span className="">v0.1.0-beta</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Life Goals</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Mobile-only menu items */}
        <div className="md:hidden">
          <SidebarSeparator />
          <SidebarGroup>
            <SidebarGroupLabel>Account</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {mobileItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <Link to={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>
      </SidebarContent>

    <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
