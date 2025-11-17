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

function ApprovedAPF() {
    const { data: approvedAPFData } = useQuery({
        queryKey: ["approvedAPF"],
        queryFn: async () => {
            const response = await axiosInstance.get("/apf/approved");
            return response.data as SubmittedAPF[];
        },
    });

    return (
        <Layout>
            <div className="p-6 space-y-6">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-blue-800">
                        Approved Activity Proposals
                    </h1>
                    <p className="text-gray-500 mt-1">
                        View all activity proposals that have been approved
                    </p>
                </div>

                <div className="overflow-x-auto">
                    <Table className="min-w-full border rounded-lg shadow-sm">
                        <TableHeader className="bg-gray-50">
                            <TableRow>
                                <TableHead className="text-left px-6 py-3">
                                    Activity Proposal Title
                                </TableHead>
                                <TableHead className="text-left px-6 py-3">
                                    Date
                                </TableHead>
                                <TableHead className="text-left px-6 py-3">
                                    Status
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {approvedAPFData && approvedAPFData.length > 0 ? (
                                approvedAPFData.map((apf) => (
                                    <TableRow
                                        key={apf._id}
                                        className="hover:bg-gray-50 transition-colors"
                                    >
                                        <TableCell className="px-6 py-3">
                                            <Link
                                                to={`/apf/${apf._id}`}
                                                className="text-blue-600 font-medium hover:underline"
                                            >
                                                {apf.title}
                                            </Link>
                                        </TableCell>
                                        <TableCell className="px-6 py-3 text-gray-600">
                                            {new Date(
                                                apf.updatedAt
                                            ).toLocaleDateString("en-US", {
                                                weekday: "short",
                                                month: "short",
                                                day: "numeric",
                                                year: "numeric",
                                            })}
                                        </TableCell>
                                        <TableCell className="px-6 py-3">
                                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-semibold">
                                                Approved
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={3}
                                        className="text-center text-gray-500 py-6"
                                    >
                                        No approved activity proposals found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </Layout>
    );
}

export default ApprovedAPF;
