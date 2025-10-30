import Layout from "@/layouts/Layout";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import api from "@/api/axios";
import { Link } from "react-router";
import type { SubmittedAPF } from "@/types/SubmittedAPF";

function PendingAPF() {
    const { data: pendingAPFData } = useQuery({
        queryKey: ["pendingAPF"],
        queryFn: async () => {
            const response = await api.get("/apf/pending");
            return response.data as SubmittedAPF[];
        },
    });
    return (
        <Layout>
            <div className="p-4">
                <h1 className="text-3xl text-center text-blue-800 font-semibold mb-8">
                    Submitted APF
                </h1>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Activity Proposal Title</TableHead>
                            <TableHead>Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {pendingAPFData && pendingAPFData.length > 0 ? (
                            pendingAPFData.map((apf) => (
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
                                    No pending activity proposals found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </Layout>
    );
}

export default PendingAPF;
