import {
    Files,
    Home,
    PenLine,
    Link as LinkIcon,
    ChevronUp,
} from "lucide-react";
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
import { Link, useLocation } from "react-router";
import { useEffect, useRef, useState } from "react";

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
        icon: LinkIcon,
        roles: ["STUDENT", "HEAD", "OSA", "VPA", "VPAA"],
    },
];

export function AppSidebar() {
    const { user, logout } = useAuth();
    const location = useLocation();
    const triggerRef = useRef<HTMLDivElement>(null);
    const [triggerWidth, setTriggerWidth] = useState<number>(0);

    useEffect(() => {
        if (triggerRef.current) {
            setTriggerWidth(triggerRef.current.offsetWidth);
        }
    }, []);

    const filteredItems = menuItems.filter((item) => {
        if (!item.roles) return true;
        return user?.role && item.roles.includes(user.role);
    });

    return (
        <Sidebar className="bg-white border-r shadow-lg">
            <SidebarHeader className="px-6 py-4 flex items-center justify-center">
                <img
                    src="/logos/uacttrack-logo-1.png"
                    alt="UActTrack-logo"
                    className="h-12 w-auto object-contain"
                />
            </SidebarHeader>

            <SidebarContent className="px-3 py-4">
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu className="space-y-1">
                            {filteredItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors hover:bg-blue-50 ${
                                            location.pathname === item.url
                                                ? "bg-blue-100 font-semibold text-blue-700"
                                                : "text-gray-700"
                                        }`}
                                    >
                                        <Link
                                            to={item.url}
                                            className="flex items-center gap-3"
                                        >
                                            <item.icon className="w-5 h-5" />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="px-3 py-4 border-t">
                <SidebarMenu>
                    <SidebarMenuItem className="w-full">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <div ref={triggerRef} className="w-full">
                                    <SidebarMenuButton className="flex items-center gap-3 w-full px-4 py-2 rounded-lg hover:bg-gray-100 transition">
                                        <Avatar className="w-8 h-8">
                                            <AvatarImage
                                                src={
                                                    user?.organizationId
                                                        ?.logo || ""
                                                }
                                            />
                                            <AvatarFallback>
                                                {user?.firstName?.[0]}
                                                {user?.lastName?.[0]}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 text-left text-gray-700 font-medium">
                                            {user?.firstName} {user?.lastName}
                                        </div>
                                        <ChevronUp className="w-4 h-4 text-gray-500" />
                                    </SidebarMenuButton>
                                </div>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent
                                side="top"
                                align="start"
                                style={{ width: triggerWidth }}
                                className="rounded-lg shadow-md"
                            >
                                <DropdownMenuItem
                                    className="flex items-center justify-start px-4 py-2 text-gray-700 hover:bg-red-100 cursor-pointer"
                                    onClick={logout}
                                >
                                    Sign out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    );
}
