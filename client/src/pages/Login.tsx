import { useState, type ChangeEvent, type FormEvent } from "react";
import useAuth from "@/hooks/useAuth";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group";
import { useNavigate } from "react-router";
import { Lock, Mail } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
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
            navigate("/");
        } catch (error) {
            console.error("Login failed:", error);
        }
    };
    return (
        <div className="relative flex min-h-screen overflow-hidden">
            <img
                src="/logos/ua-logo.png"
                alt="ua-logo"
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[500px] lg:top-auto lg:left-auto lg:translate-x-0 lg:translate-y-0 lg:bottom-0 lg:right-0 lg:w-[800px] lg:rotate-45 opacity-10 lg:opacity-30 grayscale"
            />
            <div className="w-full lg:w-1/2 flex items-center justify-center">
                <form
                    onSubmit={handleSubmit}
                    className="border rounded-md w-full max-w-md px-4 py-8 bg-blue-800"
                >
                    <h1 className="text-3xl font-semibold text-center mb-4 text-white">
                        Login
                    </h1>
                    <div className="mb-4">
                        <Label
                            htmlFor="email"
                            className="block mb-1 text-white"
                        >
                            Email
                        </Label>
                        <InputGroup>
                            <InputGroupInput
                                type="text"
                                id="email"
                                name="email"
                                onChange={handleChange}
                                className="text-white"
                            />
                            <InputGroupAddon>
                                <Mail className="text-white" />
                            </InputGroupAddon>
                        </InputGroup>
                    </div>
                    <div className="mb-4">
                        <Label
                            htmlFor="password"
                            className="block mb-1 text-white"
                        >
                            Password
                        </Label>

                        <InputGroup className="text-white">
                            <InputGroupInput
                                type="password"
                                id="password"
                                name="password"
                                onChange={handleChange}
                                className="text-white"
                            />
                            <InputGroupAddon>
                                <Lock className="text-white" />
                            </InputGroupAddon>
                        </InputGroup>
                    </div>
                    <Button className="mb-4 border rounded p-2 w-full bg-blue-800 text-white">
                        Login
                    </Button>
                    <div>
                        <p className="text-sm text-white text-center">
                            Don't have an account?{" "}
                            <a
                                href="/register"
                                className="text-blue-200 hover:underline"
                            >
                                Register
                            </a>
                        </p>
                    </div>
                </form>
            </div>
            <div className="w-1/2 hidden lg:block"></div>
        </div>
    );
}

export default Login;
