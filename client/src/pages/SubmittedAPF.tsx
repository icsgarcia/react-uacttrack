import Layout from "@/layouts/Layout";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import api from "@/api/axios";

interface SubmittedAPF {
    id: number;
    title: string;
    updatedAt: string;
}

function SubmittedAPF() {
    const { data: submittedAPFData } = useQuery({
        queryKey: ["submittedAPF"],
        queryFn: async () => {
            const response = await api.get("/apf/");
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
                    <TableCaption>
                        A list of departments submitted activity proposals.
                    </TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Activity Proposal Title</TableHead>
                            <TableHead>Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {submittedAPFData && submittedAPFData.length > 0 ? (
                            submittedAPFData.map((apf) => (
                                <TableRow key={apf.id}>
                                    <TableCell>{apf.title}</TableCell>
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
                                    No activity proposals found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </Layout>
    );
}

export default SubmittedAPF;
