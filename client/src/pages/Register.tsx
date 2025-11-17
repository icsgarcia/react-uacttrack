import api from "@/api/axios";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import useAuth from "@/hooks/useAuth";
import { toast } from "sonner";
import { Link } from "react-router";

interface Organization {
    _id: string;
    name: string;
}

interface RegisterForm {
    firstName: string;
    lastName: string;
    email: string;
    organizationId: string;
    password: string;
    confirmPassword: string;
}

function Register() {
    const { register } = useAuth();
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [registerForm, setRegisterForm] = useState<RegisterForm>({
        firstName: "",
        lastName: "",
        email: "",
        organizationId: "",
        password: "",
        confirmPassword: "",
    });

    useEffect(() => {
        const fetchOrganizations = async () => {
            try {
                const response = await api.get("/organization");
                setOrganizations(response.data);
            } catch (error) {
                console.error("Error fetching organizations:", error);
            }
        };

        fetchOrganizations();
    }, []);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setRegisterForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (registerForm.password !== registerForm.confirmPassword) {
            toast.error("Passwords do not match.");
            return;
        }

        try {
            await register(registerForm);
            toast.success("User registered successfully!");
        } catch (error) {
            console.error("Error registering user:", error);
            toast.error(
                "Registration failed. Please check your details and try again."
            );
        }
    };

    return (
        <div className="relative flex min-h-screen bg-gradient-to-br from-primary to-blue-900">
            <img
                src="/logos/ua-logo.png"
                alt="ua-logo"
                className="absolute opacity-10 grayscale w-[300px] md:w-[500px] lg:w-[750px]
        top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            />

            <div className="relative w-full flex items-center justify-center px-4 z-10">
                <form
                    onSubmit={handleSubmit}
                    className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6"
                >
                    <h1 className="text-3xl font-bold text-center text-primary">
                        Register
                    </h1>

                    <div className="space-y-1">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                            type="text"
                            id="firstName"
                            name="firstName"
                            onChange={handleChange}
                            className="focus-visible:ring-primary"
                        />
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                            type="text"
                            id="lastName"
                            name="lastName"
                            onChange={handleChange}
                            className="focus-visible:ring-primary"
                        />
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            type="text"
                            id="email"
                            name="email"
                            onChange={handleChange}
                            className="focus-visible:ring-primary"
                        />
                    </div>

                    <div className="space-y-1">
                        <Label>Department</Label>
                        <Select
                            onValueChange={(value) =>
                                setRegisterForm((prev) => ({
                                    ...prev,
                                    organizationId: value,
                                }))
                            }
                        >
                            <SelectTrigger className="focus-visible:ring-primary">
                                <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                            <SelectContent>
                                {organizations.map((org) => (
                                    <SelectItem
                                        key={org._id}
                                        value={org._id.toString()}
                                    >
                                        {org.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            type="password"
                            id="password"
                            name="password"
                            onChange={handleChange}
                            className="focus-visible:ring-primary"
                        />
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="confirmPassword">
                            Confirm Password
                        </Label>
                        <Input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            onChange={handleChange}
                            className="focus-visible:ring-primary"
                        />
                    </div>

                    <Button className="w-full bg-primary hover:bg-primary/90 text-white py-2 text-lg rounded-lg">
                        Register
                    </Button>

                    <p className="text-center text-sm text-gray-700">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="text-primary font-semibold hover:underline"
                        >
                            Login
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Register;
