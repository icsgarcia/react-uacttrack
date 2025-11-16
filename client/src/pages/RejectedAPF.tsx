import Layout from "@/layouts/Layout";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import type { SubmittedAPF } from "@/types/SubmittedAPF";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router";
import axiosInstance from "@/api/axios";

function RejectedAPF() {
    const { data: rejectedAPFData } = useQuery({
        queryKey: ["rejectedAPF"],
        queryFn: async () => {
            const response = await axiosInstance.get("/apf/rejected");
            return response.data as SubmittedAPF[];
        },
    });
    return (
        <Layout>
            <div className="p-4">
                <h1 className="text-3xl text-center text-blue-800 font-semibold mb-8">
                    Rejected APF
                </h1>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Activity Proposal Title</TableHead>
                            <TableHead>Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {rejectedAPFData && rejectedAPFData.length > 0 ? (
                            rejectedAPFData.map((apf) => (
                                <TableRow key={apf._id}>
                                    <TableCell>
                                        <Link to={`/apf/${apf._id}`}>
                                            {apf.title}
                                        </Link>
                                    </TableCell>
                                    <TableCell>
                                        {new Date(
                                            apf.updatedAt
                                        ).toLocaleDateString()}
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={2}
                                    className="text-center text-gray-500"
                                >
                                    No rejected activity proposals found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </Layout>
    );
}

export default RejectedAPF;
