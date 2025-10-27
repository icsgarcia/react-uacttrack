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
import api from "@/api/axios";
import { useQuery, useMutation } from "@tanstack/react-query";
import useAuth from "@/hooks/useAuth";
import { uploadFilesAndCreateAPF } from "@/utils/s3Upload";

interface FormData {
    cashForm: File | null;
    foodForm: File | null;
    supplyForm: File | null;
    reproductionForm: File | null;
    otherForm: File | null;
    attendees: number;
    date: string;
    startTime: string;
    endTime: string;
    venueId: string;
    title: string;
    participants: string;
    purpose: string;
    requirements: string;
    organizationId: number;
}

interface Venue {
    id: number;
    name: string;
    capacity: number;
}

const optionalForms = [
    {
        title: "Check Payment / Cash",
        name: "cashForm",
        description:
            "Funding Request Form (FRF) for P1,000 and above. Petty Cash Form (PCF) for aggregate amount below P1,000.",
    },
    { title: "Food", name: "foodForm", description: "Request for Meals (RFM)" },
    {
        title: "Supplies",
        name: "supplyForm",
        description:
            "Requisition Form (RF) for supplies available at RMS. Purchase Requisition (PR) for supplies to be purchased.",
    },
    {
        title: "Reproduction",
        name: "reproductionForm",
        description: "Reproduction Form",
    },
    { title: "Others", name: "otherForm", description: "" },
];

function CreateAPF() {
    const { user } = useAuth();
    const [formData, setFormData] = useState<FormData>({
        cashForm: null,
        foodForm: null,
        supplyForm: null,
        reproductionForm: null,
        otherForm: null,
        attendees: 0,
        date: "",
        startTime: "",
        endTime: "",
        venueId: "",
        title: "",
        participants: "",
        purpose: "",
        requirements: "",
        organizationId: user!.organization.id,
    });

    const fetchVenues = async (): Promise<Venue[]> => {
        try {
            const response = await api.get("/venues");
            return response.data;
        } catch (error) {
            console.error("Error fetching venues:", error);
            return [];
        }
    };
    const { data: venues } = useQuery<Venue[]>({
        queryKey: ["venues"],
        queryFn: fetchVenues,
    });
    const mutation = useMutation({
        mutationFn: () => uploadFilesAndCreateAPF(formData),
        onSuccess: () => {
            alert("Activity Proposal Form created successfully!");
        },
        onError: () => {
            alert("Error creating Activity Proposal Form.");
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
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        mutation.mutate();
    };
    return (
        <Layout>
            <div className="p-4">
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                        {optionalForms.map((form, index) => (
                            <Card key={index} className="mb-4">
                                <CardHeader>
                                    <CardTitle>{form.title}</CardTitle>
                                    <CardDescription>
                                        {form.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Input
                                        type="file"
                                        name={form.name}
                                        id={form.title}
                                        onChange={(e) => handleFileChange(e)}
                                    />
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <div className="mb-8">
                        <div className="mb-4">
                            <Label htmlFor="attendees" className="mb-1">
                                Number of Attendees
                            </Label>
                            <Input
                                type="number"
                                name="attendees"
                                id="attendees"
                                value={formData.attendees}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-4">
                            <Label htmlFor="date" className="mb-1">
                                Date
                            </Label>
                            <Input
                                type="date"
                                name="date"
                                id="date"
                                value={formData.date}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-4">
                            <Label htmlFor="startTime" className="mb-1">
                                Start Time
                            </Label>
                            <Input
                                type="time"
                                name="startTime"
                                id="startTime"
                                value={formData.startTime}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-4">
                            <Label htmlFor="endTime" className="mb-1">
                                End Time
                            </Label>
                            <Input
                                type="time"
                                name="endTime"
                                id="endTime"
                                value={formData.endTime}
                                onChange={handleChange}
                            />
                        </div>
                        <Button className="block mx-auto">
                            Recommend a venue
                        </Button>
                        <div>
                            <Label htmlFor="venue" className="mb-1">
                                Venue
                            </Label>
                            <Select
                                name="venueId"
                                value={formData.venueId}
                                onValueChange={(value) =>
                                    setFormData({ ...formData, venueId: value })
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a venue" />
                                </SelectTrigger>
                                <SelectContent>
                                    {venues &&
                                        venues.map((venue) => (
                                            <SelectItem
                                                key={venue.id}
                                                value={String(venue.id)}
                                            >
                                                {venue.name}
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="mb-8">
                        <div className="mb-4">
                            <Label htmlFor="title" className="mb-1">
                                Title
                            </Label>
                            <Input
                                type="text"
                                name="title"
                                id="title"
                                value={formData.title}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mb-4">
                            <Label htmlFor="participants" className="mb-1">
                                Participants
                            </Label>
                            <Textarea
                                name="participants"
                                id="participants"
                                value={formData.participants}
                                onChange={handleChange}
                            ></Textarea>
                        </div>
                        <div className="mb-4">
                            <Label htmlFor="purpose" className="mb-1">
                                Purpose
                            </Label>
                            <Textarea
                                name="purpose"
                                id="purpose"
                                value={formData.purpose}
                                onChange={handleChange}
                            ></Textarea>
                        </div>
                        <div>
                            <Label htmlFor="requirements" className="mb-1">
                                Requirements/Resources Needed
                            </Label>
                            <Textarea
                                name="requirements"
                                id="requirements"
                                value={formData.requirements}
                                onChange={handleChange}
                            ></Textarea>
                        </div>
                    </div>
                    <Button type="submit" className="block mx-auto mb-4">
                        Create Activity Proposal
                    </Button>
                </form>
            </div>
        </Layout>
    );
}

export default CreateAPF;
