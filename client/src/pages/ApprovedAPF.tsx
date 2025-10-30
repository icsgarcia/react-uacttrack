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
import api from "@/api/axios";
import { Link } from "react-router";

function ApprovedAPF() {
    const { data: approvedAPFData } = useQuery({
        queryKey: ["approvedAPF"],
        queryFn: async () => {
            const response = await api.get("/apf/approved");
            return response.data as SubmittedAPF[];
        },
    });
    return (
        <Layout>
            <div className="p-4">
                <h1 className="text-3xl text-center text-blue-800 font-semibold mb-8">
                    Approved APF
                </h1>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Activity Proposal Title</TableHead>
                            <TableHead>Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {approvedAPFData && approvedAPFData.length > 0 ? (
                            approvedAPFData.map((apf) => (
                                <TableRow key={apf.id}>
                                    <TableCell>
                                        <Link to={`/apf/${apf.id}`}>
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
                                    No approved activity proposals found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </Layout>
    );
}

export default ApprovedAPF;
