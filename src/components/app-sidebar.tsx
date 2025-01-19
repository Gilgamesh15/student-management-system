import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  FileText,
  CheckSquare,
  UserPlus,
  BookOpen,
  Users,
  Book,
  User,
} from "lucide-react";
import Link from "next/link";

const items = [
  {
    title: "Assignments",
    url: "/assignments",
    icon: FileText,
  },
  {
    title: "Attendance",
    url: "/attendance",
    icon: CheckSquare,
  },
  {
    title: "Course Enrollments",
    url: "/course-enrollments",
    icon: UserPlus,
  },
  {
    title: "Courses",
    url: "/courses",
    icon: BookOpen,
  },
  {
    title: "Students",
    url: "/students",
    icon: Users,
  },
  {
    title: "Subjects",
    url: "/subjects",
    icon: Book,
  },
  {
    title: "Teachers",
    url: "/teachers",
    icon: User,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
