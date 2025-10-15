import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import UserProfile from "@/components/UserProfile";
import Layout from "@/layouts/Layout";

function ExternalLinks() {
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
    return (
        <Layout>
            <div className="p-4">
                <UserProfile />
                <h1 className="text-3xl text-center text-blue-800 font-semibold mb-8">
                    External Links
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {externalLinks.map((elink) => (
                        <a
                            href={elink.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            key={elink.title}
                        >
                            <Card>
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
                        </a>
                    ))}
                </div>
            </div>
        </Layout>
    );
}

export default ExternalLinks;
