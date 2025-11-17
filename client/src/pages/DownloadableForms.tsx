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
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

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
    const handleClick = (name: string, link: string) => {
        if (link === "#") {
            toast.error("This form is currently unavailable.");
            return;
        }

        toast.success(`Downloading ${name}...`);

        const downloadLink = document.createElement("a");
        downloadLink.href = link;
        downloadLink.download = "";
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    };

    return (
        <Layout>
            <div className="p-4">
                <UserProfile />

                <h1 className="text-3xl text-center text-blue-800 font-semibold mb-10">
                    Downloadable Forms
                </h1>

                <div className="rounded-lg border shadow-sm overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-blue-50">
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="font-semibold text-blue-900">
                                    Form Name
                                </TableHead>
                                <TableHead className="font-semibold text-blue-900">
                                    Action
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {downloadableForms.map((form) => {
                                const disabled = form.link === "#";

                                return (
                                    <TableRow key={form.title}>
                                        <TableCell className="py-4 font-medium">
                                            {form.title}
                                        </TableCell>

                                        <TableCell>
                                            <Button
                                                onClick={() =>
                                                    handleClick(
                                                        form.title,
                                                        form.link
                                                    )
                                                }
                                                disabled={disabled}
                                                className={`w-full sm:w-auto 
                                                    ${
                                                        disabled
                                                            ? "opacity-50 cursor-not-allowed"
                                                            : "bg-blue-600 hover:bg-blue-700"
                                                    }
                                                `}
                                            >
                                                Download
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </Layout>
    );
}

export default DownloadableForms;
