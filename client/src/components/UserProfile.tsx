import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Mail } from "lucide-react";
import useAuth from "@/hooks/useAuth";

function UserProfile() {
    const { user } = useAuth();
    return (
        <div className="flex justify-between items-center mb-4">
            <div className="flex gap-4 items-center">
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <p>
                    Welcome, {user?.firstName} {user?.lastName}
                </p>
            </div>
            <div className="flex gap-4">
                <Mail />
                <Bell />
            </div>
        </div>
    );
}

export default UserProfile;
