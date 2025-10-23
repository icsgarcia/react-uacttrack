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

function SubmittedAPF() {
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
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Date</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </Layout>
    );
}

export default SubmittedAPF;
