function Register() {
    return (
        <div className="relative flex min-h-screen overflow-hidden">
            <img
                src="/logos/ua-logo.png"
                alt="ua-logo"
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[500px] lg:top-auto lg:left-auto lg:translate-x-0 lg:translate-y-0 lg:bottom-0 lg:right-0 lg:w-[800px] lg:rotate-45 opacity-10 lg:opacity-30 grayscale"
            />
            <div className="w-full lg:w-1/2 flex items-center justify-center">
                <form className="border rounded-md w-full max-w-md px-4 py-8 bg-blue-800">
                    <h1 className="text-3xl font-semibold text-center mb-4 text-white">
                        Register
                    </h1>
                    <div className="mb-4">
                        <label
                            htmlFor="firstName"
                            className="block mb-1 text-white"
                        >
                            First Name
                        </label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            className="border p-2 w-full text-white"
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="lastName"
                            className="block mb-1 text-white"
                        >
                            Last Name
                        </label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            className="border p-2 w-full text-white"
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="email"
                            className="block mb-1 text-white"
                        >
                            Email
                        </label>
                        <input
                            type="text"
                            id="email"
                            name="email"
                            className="border p-2 w-full text-white"
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="department"
                            className="block mb-1 text-white"
                        >
                            Department
                        </label>
                        <select
                            name="department"
                            id="department"
                            className="w-full p-2 border text-white"
                        >
                            <option value="">dfgdf</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="password"
                            className="block mb-1 text-white"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="border p-2 w-full text-white"
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            htmlFor="confirmPassword"
                            className="block mb-1 text-white"
                        >
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            className="border p-2 w-full text-white"
                        />
                    </div>
                    <button className="mb-4 border rounded p-2 w-full text-white">
                        Register
                    </button>
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
