import api from "@/api/axios";
import Layout from "@/layouts/Layout";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    Calendar,
    Clock,
    MapPin,
    Users,
    FileText,
    Target,
    Building2,
    User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import useAuth from "@/hooks/useAuth";
import axiosInstance from "@/api/axios";
import { toast } from "sonner";

interface APFData {
    _id: string;
    attendees: number;
    date: Date;
    startTime: string;
    endTime: string;
    title: string;
    participants: string;
    purpose: string;
    requirements: string;
    headStatus: string;
    osaStatus: string;
    vpaStatus: string;
    vpaaStatus: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    venueId: {
        _id: string;
        name: string;
        capacity: number;
    };
    userId: {
        _id: string;
        firstName: string;
        lastName: string;
        role: string;
        email: string;
        password: string;
        createdAt: Date;
        updatedAt: Date;
        organizationId: string;
    };
    organizationId: {
        _id: string;
        name: string;
        logo: string;
    };
    files: {
        cashFormFile: string;
        foodFormFile: string;
        supplyFormFile: string;
        reproductionFormFile: string;
        otherFormFile: string;
    };
}

interface FileItem {
    label: string;
    key: string;
    url: keyof APFData["files"];
}

const getStatusColor = (status: string) => {
    const colors = {
        PENDING: "bg-yellow-500",
        APPROVED: "bg-green-500",
        REJECTED: "bg-red-500",
        DRAFT: "bg-gray-500",
    };
    return colors[status as keyof typeof colors] || "bg-blue-500";
};

function APF() {
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const params = useParams();

    const fileItems: FileItem[] = [
        { label: "Check Payment / Cash", key: "cashForm", url: "cashFormFile" },
        { label: "Food", key: "foodForm", url: "foodFormFile" },
        { label: "Supplies", key: "supplyForm", url: "supplyFormFile" },
        {
            label: "Reproduction",
            key: "reproductionForm",
            url: "reproductionFormFile",
        },
        { label: "Others", key: "otherForm", url: "otherFormFile" },
    ];

    const getAPFById = async () => {
        const { data } = await api.get(`/apf/${params.id}`);
        console.log(data);
        return data as APFData;
    };

    const { data, isLoading, isError } = useQuery({
        queryKey: ["apf", params.id],
        queryFn: getAPFById,
    });

    const showActionButtons =
        data?.status === "PENDING" &&
        ((user?.role === "HEAD" && data?.headStatus === "PENDING") ||
            (user?.role === "OSA" && data?.osaStatus === "PENDING") ||
            (user?.role === "VPA" && data?.vpaStatus === "PENDING") ||
            (user?.role === "VPAA" && data?.vpaaStatus === "PENDING"));

    const handleReject = async () => {
        try {
            await axiosInstance.patch(`/apf/reject/${params.id}`);
            queryClient.invalidateQueries({ queryKey: ["apf", params.id] });
            toast.success("Activity Proposal rejected successfully.");
        } catch (error) {
            console.error(error);
            toast.error(
                "Failed to reject activity proposal. Please try again."
            );
        }
    };
    const handleApprove = async () => {
        try {
            await axiosInstance.patch(`/apf/approve/${params.id}`);
            queryClient.invalidateQueries({ queryKey: ["apf", params.id] });
            toast.success("Activity Proposal approved successfully.");
        } catch (error) {
            console.error(error);
            toast.error(
                "Failed to approve activity proposal. Please try again."
            );
        }
    };

    if (isLoading) {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-screen">
                    <p className="text-lg text-gray-600">
                        Loading activity proposal...
                    </p>
                </div>
            </Layout>
        );
    }

    if (isError || !data) {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-screen">
                    <p className="text-lg text-red-600">
                        Error loading activity proposal
                    </p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
                {/* HEADER */}
                <Card className="rounded-xl border-l-4 border-blue-800 shadow-sm">
                    <CardHeader className="space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                            <div className="space-y-1">
                                <CardTitle className="text-3xl font-bold text-blue-900">
                                    {data.title}
                                </CardTitle>
                                <CardDescription className="text-base text-gray-600">
                                    Activity Approval Form for In-Campus
                                    Activities
                                </CardDescription>
                            </div>

                            <Badge
                                className={`${getStatusColor(
                                    data.status
                                )} text-white text-sm px-4 py-2`}
                            >
                                {data.status}
                            </Badge>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <span className="font-semibold">Control No:</span>
                            <span className="font-mono bg-gray-100 px-3 py-1 rounded">
                                AF-{String(data._id).padStart(6, "0")}
                            </span>
                        </div>
                    </CardHeader>
                </Card>

                {/* BASIC INFORMATION */}
                <Card className="rounded-xl border shadow-sm">
                    <CardHeader className="border-b bg-gray-50">
                        <CardTitle className="text-xl font-semibold text-gray-800">
                            Basic Information
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                        {/* Organization */}
                        <div className="flex items-start gap-3">
                            <Building2 className="w-6 h-6 text-blue-700 mt-1" />
                            <div>
                                <p className="text-sm font-medium text-gray-500">
                                    Department / Office
                                </p>
                                <p className="text-base font-semibold text-gray-800">
                                    {data.organizationId.name}
                                </p>
                            </div>
                        </div>

                        {/* Prepared By */}
                        <div className="flex items-start gap-3">
                            <User className="w-6 h-6 text-blue-700 mt-1" />
                            <div>
                                <p className="text-sm font-medium text-gray-500">
                                    Prepared By
                                </p>
                                <p className="text-base font-semibold text-gray-800">
                                    {data.userId.firstName}{" "}
                                    {data.userId.lastName}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* ACTIVITY DETAILS */}
                <Card className="rounded-xl border shadow-sm">
                    <CardHeader className="border-b bg-gray-50">
                        <CardTitle className="text-xl font-semibold text-gray-800">
                            Activity Details
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Date */}
                            <div className="flex items-start gap-3">
                                <Calendar className="w-6 h-6 text-blue-700 mt-1" />
                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        Date
                                    </p>
                                    <p className="text-base font-semibold">
                                        {new Date(data.date).toLocaleDateString(
                                            "en-US",
                                            {
                                                weekday: "long",
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            }
                                        )}
                                    </p>
                                </div>
                            </div>

                            {/* Time */}
                            <div className="flex items-start gap-3">
                                <Clock className="w-6 h-6 text-blue-700 mt-1" />
                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        Time
                                    </p>
                                    <p className="text-base font-semibold">
                                        {data.startTime} – {data.endTime}
                                    </p>
                                </div>
                            </div>

                            {/* Venue */}
                            <div className="flex items-start gap-3">
                                <MapPin className="w-6 h-6 text-blue-700 mt-1" />
                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        Venue
                                    </p>
                                    <p className="text-base font-semibold">
                                        {data.venueId.name}
                                    </p>
                                </div>
                            </div>

                            {/* Attendees */}
                            <div className="flex items-start gap-3">
                                <Users className="w-6 h-6 text-blue-700 mt-1" />
                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        Expected Attendees
                                    </p>
                                    <p className="text-base font-semibold">
                                        {data.attendees} people
                                    </p>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Participants */}
                        <div className="flex items-start gap-3">
                            <Users className="w-6 h-6 text-blue-700 mt-1" />
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">
                                    Participants (Department/Program/Year Level)
                                </p>
                                <p className="text-gray-700 leading-relaxed">
                                    {data.participants}
                                </p>
                            </div>
                        </div>

                        {/* Purpose */}
                        <div className="flex items-start gap-3">
                            <Target className="w-6 h-6 text-blue-700 mt-1" />
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">
                                    Purpose / Objective
                                </p>
                                <p className="text-gray-700 leading-relaxed">
                                    {data.purpose}
                                </p>
                            </div>
                        </div>

                        {/* Requirements */}
                        <div className="flex items-start gap-3">
                            <FileText className="w-6 h-6 text-blue-700 mt-1" />
                            <div>
                                <p className="text-sm font-medium text-gray-500 mb-1">
                                    Requirements / Resources Needed
                                </p>
                                <p className="text-gray-700 leading-relaxed">
                                    {data.requirements}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* PROJECTED FUNDING NEEDS */}
                <Card className="rounded-xl border shadow-sm">
                    <CardHeader className="border-b bg-gray-50">
                        <CardTitle className="text-xl font-semibold text-gray-800">
                            Projected Funding Needs
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="p-6">
                        <div className="overflow-hidden border border-gray-200 rounded-lg">
                            <table className="w-full">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                                            Nature
                                        </th>
                                        <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 border-b">
                                            Form Attached
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {fileItems.map((item) => (
                                        <tr
                                            key={item.key}
                                            className="even:bg-gray-50 hover:bg-gray-100 transition"
                                        >
                                            <td className="px-4 py-3 text-sm border-b text-gray-800">
                                                {item.label}
                                            </td>
                                            <td className="px-4 py-3 border-b text-center">
                                                {data.files &&
                                                data.files[item.url] ? (
                                                    <a
                                                        href={
                                                            data.files[item.url]
                                                        }
                                                        target="_blank"
                                                        className="text-blue-700 underline"
                                                        rel="noopener noreferrer"
                                                    >
                                                        View File
                                                    </a>
                                                ) : (
                                                    <span className="text-gray-400">
                                                        N/A
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                {/* APPROVAL SECTION */}
                <Card className="rounded-xl border shadow-sm">
                    <CardHeader className="border-b bg-gray-50">
                        <CardTitle className="text-xl font-semibold text-gray-800">
                            Endorsements & Approvals
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {[
                                {
                                    title: "Head of Organization",
                                    status: data.headStatus,
                                },
                                {
                                    title: "Office of Student Affairs",
                                    status: data.osaStatus,
                                },
                                {
                                    title: "VP for Administration",
                                    status: data.vpaStatus,
                                },
                                {
                                    title: "VP for Academic Affairs",
                                    status: data.vpaaStatus,
                                },
                            ].map((approval, idx) => (
                                <div
                                    key={idx}
                                    className="p-4 bg-white border rounded-xl shadow-sm"
                                >
                                    <p className="text-sm font-medium text-gray-600">
                                        {approval.title}
                                    </p>
                                    <Badge
                                        className={`${getStatusColor(
                                            approval.status
                                        )} text-white mt-2`}
                                    >
                                        {approval.status}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* TIMESTAMPS */}
                <Card className="rounded-xl border shadow-sm">
                    <CardContent className="flex flex-col sm:flex-row sm:justify-between p-6 text-sm text-gray-600 gap-2">
                        <div>
                            <span className="font-semibold">Created: </span>
                            {new Date(data.createdAt).toLocaleString()}
                        </div>
                        <div>
                            <span className="font-semibold">
                                Last Updated:{" "}
                            </span>
                            {new Date(data.updatedAt).toLocaleString()}
                        </div>
                    </CardContent>
                </Card>

                {/* ACTION BUTTONS */}
                {showActionButtons && (
                    <div className="flex justify-center gap-4 py-4">
                        <Button
                            onClick={handleReject}
                            variant="destructive"
                            className="px-10 py-2 text-lg rounded-lg"
                        >
                            Reject
                        </Button>

                        <Button
                            onClick={handleApprove}
                            className="px-10 py-2 text-lg rounded-lg bg-green-700 hover:bg-green-600 text-white"
                        >
                            Approve
                        </Button>
                    </div>
                )}
            </div>
        </Layout>
    );
}

export default APF;
