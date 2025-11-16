import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/api/axios";

export interface Holiday {
    date: string;
    localName: string;
    name: string;
    countryCode: string;
    fixed: boolean;
    global: boolean;
    counties: string | null;
    launchYear: string | null;
    types: string[];
}

const useHolidays = () => {
    return useQuery({
        queryKey: ["holidays"],
        queryFn: async () => {
            const { data } = await axiosInstance.get<Holiday[]>("/calendar");
            return data;
        },
    });
};

export default useHolidays;
