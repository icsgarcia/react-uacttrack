import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import UserProfile from "@/components/UserProfile";
import Layout from "@/layouts/Layout";
import { toast } from "sonner";

const externalLinks = [
    {
        title: "University of the Assumption",
        desc: "Official Website of the University of the Assumption",
        image: "/logos/ua-logo.png",
        url: "https://web.ua.edu.ph/",
    },
    {
        title: "University of the Assumption - SERP",
        desc: "Official Website of the University of the Assumption - SERP",
        image: "/logos/ua-logo.png",
        url: "https://serp.ua.edu.ph/serp/Gate/UASFP.Login.aspx",
    },
    {
        title: "RSOinTrack",
        desc: "Official Website of RSOinTrack",
        image: "/logos/RSOinTrack-logo.png",
        url: "#",
    },
];

function ExternalLinks() {
    const handleClick = (title: string, link: string) => {
        if (link === "#") {
            toast.error("This link is currently unavailable.");
            return;
        }
        toast.info(`Opening ${title}...`);
        window.open(link, "_blank", "noopener,noreferrer");
    };

    return (
        <Layout>
            <div className="p-4">
                <UserProfile />

                <h1 className="text-3xl text-center text-blue-800 font-semibold mb-10">
                    External Links
                </h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {externalLinks.map((elink, index) => {
                        const disabled = elink.url === "#";

                        return (
                            <Card
                                key={index}
                                role={disabled ? "presentation" : "button"}
                                onClick={() =>
                                    !disabled &&
                                    handleClick(elink.title, elink.url)
                                }
                                className={`transition-all rounded-xl shadow-sm border 
                                    ${
                                        disabled
                                            ? "opacity-40 cursor-not-allowed"
                                            : "cursor-pointer hover:shadow-lg hover:border-blue-600"
                                    }
                                `}
                            >
                                <CardHeader className="text-center space-y-1">
                                    <CardTitle className="text-blue-900">
                                        {elink.title}
                                    </CardTitle>
                                    <CardDescription>
                                        {elink.desc}
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="flex justify-center py-4">
                                    <img
                                        src={elink.image}
                                        alt={elink.title}
                                        className="w-40 h-40 object-contain"
                                    />
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </Layout>
    );
}

export default ExternalLinks;
