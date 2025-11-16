import axiosInstance from "@/api/axios";
import { useQuery } from "@tanstack/react-query";

export interface SchoolActivity {
    _id: string;
    title: string;
    date: string;
    startTime: string;
    endTime: string;
    venueId: {
        _id: string;
        name: string;
    };
    organizationId: {
        _id: string;
        name: string;
    };
}

const useSchoolActivities = () => {
    return useQuery({
        queryKey: ["schoolActivities"],
        queryFn: async () => {
            const { data } = await axiosInstance.get<SchoolActivity[]>(
                "/calendar/apf"
            );
            console.log("Fetched school activities:", data);
            return data;
        },
    });
};

export default useSchoolActivities;
