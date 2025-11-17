import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useAuth from "@/hooks/useAuth";
import { Bell, Mail } from "lucide-react";

function UserProfile() {
    const { user } = useAuth();

    return (
        <div className="flex justify-between items-center mb-6 p-4 bg-white rounded-xl shadow-sm border">
            <div className="flex items-center gap-4">
                <Avatar className="w-14 h-14">
                    <AvatarImage src={user?.organizationId.logo} />
                    <AvatarFallback>
                        {user?.firstName?.[0]}
                        {user?.lastName?.[0]}
                    </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <p className="text-gray-500 text-sm">Welcome Back</p>
                    <p className="text-lg font-semibold text-gray-800">
                        {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-sm text-gray-400">
                        {user?.organizationId.name}
                    </p>
                </div>
            </div>

            <div className="flex gap-3">
                <button className="p-2 rounded-lg hover:bg-gray-100 transition">
                    <Mail className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 rounded-lg hover:bg-gray-100 transition">
                    <Bell className="w-5 h-5 text-gray-600" />
                </button>
            </div>
        </div>
    );
}

export default UserProfile;
