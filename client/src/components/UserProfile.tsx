import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Mail } from "lucide-react";
import useAuth from "@/hooks/useAuth";
import { useEffect } from "react";

function UserProfile() {
    const { user } = useAuth();
    useEffect(() => {
        console.log(user);
    }, [user]);
    return (
        <div className="flex justify-between items-center mb-4">
            <div className="flex gap-4 items-center">
                <Avatar>
                    <AvatarImage src={user?.organization.logoUrl} />
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
