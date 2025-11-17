import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import Layout from "@/layouts/Layout";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { uploadFilesAndCreateAPF } from "@/utils/S3Upload";
import useVenues from "@/hooks/useVenues";
import { toast } from "sonner";
import { useNavigate } from "react-router";

interface FormData {
    title: string;
    purpose: string;
    participants: string;
    attendees: number;
    requirements: string;
    date: string;
    startTime: string;
    endTime: string;
    cashForm: File | null;
    foodForm: File | null;
    supplyForm: File | null;
    reproductionForm: File | null;
    otherForm: File | null;
    venueId: string;
}

const optionalForms = [
    {
        title: "Check Payment / Cash",
        name: "cashForm",
        description:
            "Funding Request Form (FRF) for P1,000 and above. Petty Cash Form (PCF) for below P1,000.",
    },
    { title: "Food", name: "foodForm", description: "Request for Meals (RFM)" },
    {
        title: "Supplies",
        name: "supplyForm",
        description:
            "Requisition Form (RF) or Purchase Requisition Form (PRF).",
    },
    {
        title: "Reproduction",
        name: "reproductionForm",
        description: "Reproduction Form",
    },
    { title: "Others", name: "otherForm", description: "" },
];

function CreateAPF() {
    const { data: venues } = useVenues();
    const navigate = useNavigate();
    const [formData, setFormData] = useState<FormData>({
        title: "",
        purpose: "",
        participants: "",
        attendees: 0,
        requirements: "",
        date: "",
        startTime: "",
        endTime: "",
        cashForm: null,
        foodForm: null,
        supplyForm: null,
        reproductionForm: null,
        otherForm: null,
        venueId: "",
    });

    const recommendVenue = (attendees: number) => {
        if (attendees <= 0) {
            toast.error("Enter attendees first. Must be greater than zero.");
            return;
        }

        const recommended = venues?.find((v) => attendees <= v.capacity);

        if (recommended) {
            toast.info(`Recommended Venue: ${recommended.name}`);
            setFormData((prev) => ({ ...prev, venueId: recommended._id }));
        } else {
            toast.error("No venue fits this capacity.");
        }
    };

    const mutation = useMutation({
        mutationFn: () => uploadFilesAndCreateAPF(formData),
        onSuccess: () => {
            toast.success("Activity Proposal created successfully.");
            navigate("/pending-apf");
        },
        onError: () => {
            toast.error("Failed to create APF. Please try again.");
        },
    });

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name } = e.target;
        if (e.target.files && e.target.files[0]) {
            setFormData((prev) => ({
                ...prev,
                [name]: e.target.files![0],
            }));
        }
    };

    const handleChange = (
        e: ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: name === "attendees" ? Number(value) : value,
        }));
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (
            !formData.title ||
            !formData.purpose ||
            !formData.participants ||
            !formData.attendees ||
            !formData.requirements ||
            !formData.date ||
            !formData.startTime ||
            !formData.endTime ||
            !formData.venueId
        ) {
            toast.error("Please fill in all required fields.");
            return;
        }

        if (formData.startTime >= formData.endTime) {
            toast.error("End time must be later than start time.");
            return;
        }

        mutation.mutate();
    };

    return (
        <Layout>
            <div className="p-4">
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    {/* Optional Forms */}
                    <h2 className="text-2xl font-semibold text-blue-800 mb-4">
                        Optional Attachments
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
                        {optionalForms.map((form) => (
                            <Card key={form.title} className="shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-blue-700">
                                        {form.title}
                                    </CardTitle>
                                    <CardDescription>
                                        {form.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Input
                                        type="file"
                                        name={form.name}
                                        id={form.title}
                                        accept=".doc,.docx,.xls,.xlsx,.pdf"
                                        onChange={handleFileChange}
                                    />
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Event Details */}
                    <Card className="mb-10 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-blue-800">
                                Event Schedule & Venue
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div>
                                <Label htmlFor="attendees">Attendees</Label>
                                <Input
                                    type="number"
                                    name="attendees"
                                    id="attendees"
                                    value={formData.attendees}
                                    onChange={handleChange}
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <Label htmlFor="date">Date</Label>
                                <Input
                                    type="date"
                                    name="date"
                                    id="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <Label htmlFor="startTime">Start Time</Label>
                                <Input
                                    type="time"
                                    name="startTime"
                                    id="startTime"
                                    value={formData.startTime}
                                    onChange={handleChange}
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <Label htmlFor="endTime">End Time</Label>
                                <Input
                                    type="time"
                                    name="endTime"
                                    id="endTime"
                                    value={formData.endTime}
                                    onChange={handleChange}
                                    className="mt-1"
                                />
                            </div>

                            <div className="sm:col-span-2 lg:col-span-1 flex flex-col gap-2">
                                <Button
                                    type="button"
                                    onClick={() =>
                                        recommendVenue(formData.attendees)
                                    }
                                    disabled={!venues}
                                    className="bg-blue-700 hover:bg-blue-800 w-full"
                                >
                                    Recommend Venue
                                </Button>

                                <Label htmlFor="venueId">Venue</Label>
                                <Select
                                    value={formData.venueId}
                                    onValueChange={(value) =>
                                        setFormData({
                                            ...formData,
                                            venueId: value,
                                        })
                                    }
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a venue" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        {venues?.map((venue) => (
                                            <SelectItem
                                                key={venue._id}
                                                value={venue._id}
                                            >
                                                {venue.name} (Capacity:{" "}
                                                {venue.capacity})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Proposal Details */}
                    <Card className="mb-10 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-blue-800">
                                Activity Proposal Details
                            </CardTitle>
                        </CardHeader>

                        <CardContent className="grid gap-6">
                            <div>
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    type="text"
                                    name="title"
                                    id="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <Label htmlFor="participants">
                                    Participants
                                </Label>
                                <Textarea
                                    name="participants"
                                    id="participants"
                                    value={formData.participants}
                                    onChange={handleChange}
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <Label htmlFor="purpose">Purpose</Label>
                                <Textarea
                                    name="purpose"
                                    id="purpose"
                                    value={formData.purpose}
                                    onChange={handleChange}
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <Label htmlFor="requirements">
                                    Requirements / Resources Needed
                                </Label>
                                <Textarea
                                    name="requirements"
                                    id="requirements"
                                    value={formData.requirements}
                                    onChange={handleChange}
                                    className="mt-1"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Button
                        type="submit"
                        className="block mx-auto bg-blue-700 hover:bg-blue-800 px-8 py-2 text-lg"
                    >
                        Create Activity Proposal
                    </Button>
                </form>
            </div>
        </Layout>
    );
}

export default CreateAPF;
