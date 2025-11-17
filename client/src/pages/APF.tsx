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
            <div className="max-w-6xl mx-auto p-6 space-y-6">
                {/* Header Section */}
                <Card>
                    <CardHeader className="space-y-4">
                        <div className="flex items-start justify-between">
                            <div className="space-y-2">
                                <CardTitle className="text-3xl font-bold text-blue-800">
                                    {data.title}
                                </CardTitle>
                                <CardDescription className="text-base">
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

                {/* Basic Information */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl">
                            Basic Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid md:grid-cols-2 gap-6">
                        <div className="flex items-start gap-3">
                            <Building2 className="w-5 h-5 text-blue-600 mt-1" />
                            <div>
                                <p className="text-sm font-semibold text-gray-600">
                                    Department/Office
                                </p>
                                <p className="text-base font-medium">
                                    {data.organizationId.name}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <User className="w-5 h-5 text-blue-600 mt-1" />
                            <div>
                                <p className="text-sm font-semibold text-gray-600">
                                    Prepared By
                                </p>
                                <p className="text-base font-medium">
                                    {data.userId.firstName}{" "}
                                    {data.userId.lastName}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Activity Details */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl">
                            Activity Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="flex items-start gap-3">
                                <Calendar className="w-5 h-5 text-blue-600 mt-1" />
                                <div>
                                    <p className="text-sm font-semibold text-gray-600">
                                        Date
                                    </p>
                                    <p className="text-base font-medium">
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

                            <div className="flex items-start gap-3">
                                <Clock className="w-5 h-5 text-blue-600 mt-1" />
                                <div>
                                    <p className="text-sm font-semibold text-gray-600">
                                        Time
                                    </p>
                                    <p className="text-base font-medium">
                                        {data.startTime} - {data.endTime}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-blue-600 mt-1" />
                                <div>
                                    <p className="text-sm font-semibold text-gray-600">
                                        Venue
                                    </p>
                                    <p className="text-base font-medium">
                                        {data.venueId.name}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <Users className="w-5 h-5 text-blue-600 mt-1" />
                                <div>
                                    <p className="text-sm font-semibold text-gray-600">
                                        Expected Attendees
                                    </p>
                                    <p className="text-base font-medium">
                                        {data.attendees} people
                                    </p>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        <div className="flex items-start gap-3">
                            <Users className="w-5 h-5 text-blue-600 mt-1" />
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-gray-600 mb-2">
                                    Participants (Department/Program/Year Level)
                                </p>
                                <p className="text-base text-gray-700 leading-relaxed">
                                    {data.participants}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <Target className="w-5 h-5 text-blue-600 mt-1" />
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-gray-600 mb-2">
                                    Purpose/Objective
                                </p>
                                <p className="text-base text-gray-700 leading-relaxed">
                                    {data.purpose}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <FileText className="w-5 h-5 text-blue-600 mt-1" />
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-gray-600 mb-2">
                                    Requirements/Resources Needed
                                </p>
                                <p className="text-base text-gray-700 leading-relaxed">
                                    {data.requirements}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Projected Funding Needs */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl">
                            Projected Funding Needs
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-gray-50">
                                        <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">
                                            Nature
                                        </th>
                                        <th className="border border-gray-300 px-4 py-3 text-center font-semibold text-gray-700">
                                            Form Attached
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {fileItems.map((item) => (
                                        <tr
                                            key={item.key}
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="border border-gray-300 px-4 py-3">
                                                {item.label}
                                            </td>
                                            <td className="border border-gray-300 px-4 py-3 text-center">
                                                {data.files &&
                                                data.files[item.url] ? (
                                                    <a
                                                        href={
                                                            data.files[item.url]
                                                        }
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        download={
                                                            data.files[item.url]
                                                        }
                                                    >
                                                        {item.label} File
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

                {/* Approval Section */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl">
                            Endorsements & Approvals
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                                    title: "Vice President for Administration",
                                    status: data.vpaStatus,
                                },
                                {
                                    title: "Vice President for Academic Affairs",
                                    status: data.vpaaStatus,
                                },
                            ].map((approval, index) => (
                                <div
                                    key={index}
                                    className="p-4 border rounded-lg bg-gray-50"
                                >
                                    <p className="text-sm font-semibold text-gray-600 mb-2">
                                        {approval.title}
                                    </p>
                                    <Badge
                                        className={`${getStatusColor(
                                            approval.status
                                        )} text-white`}
                                    >
                                        {approval.status}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Timestamps */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex justify-between text-sm text-gray-600">
                            <div>
                                <span className="font-semibold">Created:</span>{" "}
                                {new Date(data.createdAt).toLocaleString()}
                            </div>
                            <div>
                                <span className="font-semibold">
                                    Last Updated:
                                </span>{" "}
                                {new Date(data.updatedAt).toLocaleString()}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {showActionButtons && (
                    <Card>
                        <CardContent className="flex justify-center items-center gap-8">
                            <Button onClick={handleReject}>Reject</Button>
                            <Button onClick={handleApprove}>Approve</Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </Layout>
    );
}

export default APF;
