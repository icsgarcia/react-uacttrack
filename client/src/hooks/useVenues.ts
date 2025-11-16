import axiosInstance from "@/api/axios";
import { useQuery } from "@tanstack/react-query";
import type { Venue } from "@/types/venue";

const fetchVenues = async (): Promise<Venue[]> => {
    try {
        const { data } = await axiosInstance.get("/venues");
        return data;
    } catch (error) {
        console.error("Error fetching venues:", error);
        return [];
    }
};

const useVenues = () => {
    return useQuery<Venue[]>({
        queryKey: ["venues"],
        queryFn: fetchVenues,
    });
};

export default useVenues;
