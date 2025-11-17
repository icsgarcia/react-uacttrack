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
        <div className="relative flex min-h-screen overflow-hidden">
            <img
                src="/logos/ua-logo.png"
                alt="ua-logo"
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[500px] lg:top-auto lg:left-auto lg:translate-x-0 lg:translate-y-0 lg:bottom-0 lg:right-0 lg:w-[800px] lg:rotate-45 opacity-30 grayscale"
            />
            <div className="w-full lg:w-1/2 flex items-center justify-center z-50">
                <form
                    onSubmit={handleSubmit}
                    className="border rounded-md w-full max-w-md px-4 py-8 bg-blue-800"
                >
                    <h1 className="text-3xl font-semibold text-center mb-4 text-white">
                        Register
                    </h1>
                    <div className="mb-4">
                        <Label
                            htmlFor="firstName"
                            className="block mb-1 text-white"
                        >
                            First Name
                        </Label>
                        <Input
                            type="text"
                            id="firstName"
                            name="firstName"
                            onChange={handleChange}
                            className="border p-2 w-full text-white"
                        />
                    </div>
                    <div className="mb-4">
                        <Label
                            htmlFor="lastName"
                            className="block mb-1 text-white"
                        >
                            Last Name
                        </Label>
                        <Input
                            type="text"
                            id="lastName"
                            name="lastName"
                            onChange={handleChange}
                            className="border p-2 w-full text-white"
                        />
                    </div>
                    <div className="mb-4">
                        <Label
                            htmlFor="email"
                            className="block mb-1 text-white"
                        >
                            Email
                        </Label>
                        <Input
                            type="text"
                            id="email"
                            name="email"
                            onChange={handleChange}
                            className="border p-2 w-full text-white"
                        />
                    </div>
                    <div className="mb-4">
                        <Label
                            htmlFor="department"
                            className="block mb-1 text-white"
                        >
                            Department
                        </Label>

                        <Select
                            name="department"
                            onValueChange={(value) =>
                                setRegisterForm((prev) => ({
                                    ...prev,
                                    organizationId: value,
                                }))
                            }
                        >
                            <SelectTrigger className="w-full border p-2 text-white">
                                <SelectValue
                                    placeholder="Department"
                                    className="text-white placeholder:text-white"
                                />
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
                    <div className="mb-4">
                        <Label
                            htmlFor="password"
                            className="block mb-1 text-white"
                        >
                            Password
                        </Label>
                        <Input
                            type="password"
                            id="password"
                            name="password"
                            onChange={handleChange}
                            className="border p-2 w-full text-white"
                        />
                    </div>
                    <div className="mb-4">
                        <Label
                            htmlFor="confirmPassword"
                            className="block mb-1 text-white"
                        >
                            Confirm Password
                        </Label>
                        <Input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            onChange={handleChange}
                            className="border p-2 w-full text-white"
                        />
                    </div>
                    <Button className="mb-4 border rounded p-2 w-full text-white">
                        Register
                    </Button>
                    <div>
                        <p className="text-sm text-white text-center">
                            Already have an account?{" "}
                            <a
                                href="/login"
                                className="text-blue-200 hover:underline"
                            >
                                Login
                            </a>
                        </p>
                    </div>
                </form>
            </div>
            <div className="w-1/2 hidden lg:block"></div>
        </div>
    );
}

export default Register;
