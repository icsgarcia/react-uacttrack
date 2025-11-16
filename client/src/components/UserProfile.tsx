import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useAuth from "@/hooks/useAuth";
import { Bell, Mail } from "lucide-react";

function UserProfile() {
    const { user } = useAuth();
    return (
        <div className="flex justify-between items-center mb-4">
            <div className="flex gap-4 items-center">
                <Avatar>
                    <AvatarImage src={user?.organizationId.logo} />
                    <AvatarFallback>{user?.organizationId.name}</AvatarFallback>
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
