import { useState, type ChangeEvent, type FormEvent } from "react";
import useAuth from "@/hooks/useAuth";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group";
import { Lock, Mail } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Link } from "react-router";

function Login() {
    const { login } = useAuth();
    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLoginData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await login(loginData);
            toast.success("Logged in successfully!");
        } catch (error) {
            console.error("Login failed:", error);
            toast.error(
                "Login failed. Please check your credentials and try again."
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
                        Login
                    </h1>

                    <div className="space-y-1">
                        <Label htmlFor="email" className="text-gray-700">
                            Email
                        </Label>
                        <InputGroup>
                            <InputGroupInput
                                type="text"
                                id="email"
                                name="email"
                                onChange={handleChange}
                                className="focus-visible:ring-primary"
                            />
                            <InputGroupAddon>
                                <Mail className="text-primary" />
                            </InputGroupAddon>
                        </InputGroup>
                    </div>

                    <div className="space-y-1">
                        <Label htmlFor="password" className="text-gray-700">
                            Password
                        </Label>
                        <InputGroup>
                            <InputGroupInput
                                type="password"
                                id="password"
                                name="password"
                                onChange={handleChange}
                                className="focus-visible:ring-primary"
                            />
                            <InputGroupAddon>
                                <Lock className="text-primary" />
                            </InputGroupAddon>
                        </InputGroup>
                    </div>

                    <Button className="w-full bg-primary hover:bg-primary/90 text-white py-2 text-lg rounded-lg">
                        Login
                    </Button>

                    <p className="text-center text-sm text-gray-700">
                        Don’t have an account?{" "}
                        <Link
                            to="/register"
                            className="text-primary font-semibold hover:underline"
                        >
                            Register
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default Login;
