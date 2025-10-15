import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import UserProfile from "@/components/UserProfile";
import Layout from "@/layouts/Layout";

const downloadableForms = [
    {
        title: "Funding Request Form",
        link: "/forms/FRF.xls",
    },
    {
        title: "Petty Cash Form",
        link: "/forms/PCF.xlsx",
    },
    {
        title: "Request for Meals Form",
        link: "/forms/RFM.xlsx",
    },
    {
        title: "Requisition Form",
        link: "/forms/RF.doc",
    },
    {
        title: "Purchase Requisition Form",
        link: "/forms/PRF.doc",
    },
    {
        title: "Reproduction Form",
        link: "#",
    },
    {
        title: "Supplies and Maintenance Request Form",
        link: "/forms/SaMRF.docx",
    },
];

function DownloadableForms() {
    return (
        <Layout>
            <div className="p-4">
                <UserProfile />
                <h1 className="text-3xl text-center text-blue-800 font-semibold mb-8">
                    Downloadable Forms
                </h1>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Forms</TableHead>
                            <TableHead>Download</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {downloadableForms.map((form) => (
                            <TableRow key={form.title}>
                                <TableCell>{form.title}</TableCell>
                                <TableCell>
                                    <a
                                        href={form.link}
                                        className="underline hover:text-blue-800"
                                    >
                                        Download Form
                                    </a>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </Layout>
    );
}

export default DownloadableForms;
