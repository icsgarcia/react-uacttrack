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
                <h1 className="text-3xl text-center text-blue-800 font-semibold mb-8">
                    External Links
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {externalLinks.map((elink, index) => {
                        const disabled = elink.url === "#";
                        return (
                            <Card
                                key={index}
                                role="button"
                                onClick={() =>
                                    !disabled &&
                                    handleClick(elink.title, elink.url)
                                }
                                tabIndex={disabled ? -1 : 0}
                                className={`cursor-pointer transition hover:shadow-lg ${
                                    disabled
                                        ? "opacity-50 cursor-not-allowed"
                                        : "hover:bg-gray-50"
                                }`}
                            >
                                <CardHeader className="text-center">
                                    <CardTitle>{elink.title}</CardTitle>
                                    <CardDescription>
                                        {elink.desc}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <img
                                        src={elink.image}
                                        alt={elink.title}
                                        className="size-64 mx-auto"
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
