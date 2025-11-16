import { Files, Home, PenLine, Link as link, ChevronUp } from "lucide-react";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import useAuth from "@/hooks/useAuth";
import { Link } from "react-router";

const menuItems = [
    {
        title: "Dashboard",
        url: "/",
        icon: Home,
        roles: ["STUDENT", "HEAD", "OSA", "VPA", "VPAA"],
    },
    {
        title: "Create APF",
        url: "/create-apf",
        icon: PenLine,
        roles: ["STUDENT"],
    },
    {
        title: "Downloadable Forms",
        url: "/downloadable-forms",
        icon: Files,
        roles: ["STUDENT", "HEAD", "OSA", "VPA", "VPAA"],
    },
    {
        title: "External Links",
        url: "/external-links",
        icon: link,
        roles: ["STUDENT", "HEAD", "OSA", "VPA", "VPAA"],
    },
];

export function AppSidebar() {
    const { user, logout } = useAuth();

    const filteredItems = menuItems.filter((item) => {
        if (!item.roles) return true;
        return user?.role && item.roles.includes(user.role);
    });

    return (
        <Sidebar>
            <SidebarHeader>
                <img src="/logos/uacttrack-logo-1.png" alt="UActTrack-logo" />
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {filteredItems.map((item) => (
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
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton>
                                    <Avatar>
                                        <AvatarImage src="https://github.com/shadcn.png" />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                    {user?.firstName} {user?.lastName}
                                    <ChevronUp className="ml-auto" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                side="top"
                                className="w-[--radix-popper-anchor-width]"
                            >
                                <DropdownMenuItem>
                                    <span onClick={logout}>Sign out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
