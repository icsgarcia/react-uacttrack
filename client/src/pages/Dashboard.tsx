import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Layout from "@/layouts/Layout";
import UserProfile from "@/components/UserProfile";
import Calendar from "@/components/Calendar";
import { Link } from "react-router";

function Dashboard() {
    const cardData = [
        {
            title: "Pending APF",
            desc: "This is the pending APF.",
            link: "/pending-apf",
        },
        {
            title: "Approved APF",
            desc: "This is the approved APF.",
            link: "/approved-apf",
        },
        {
            title: "Rejected APF",
            desc: "This is the rejected APF.",
            link: "/rejected-apf",
        },
    ];
    return (
        <Layout>
            <div className="p-4">
                <UserProfile />
                <h1 className="text-3xl text-center text-blue-800 font-semibold mb-8">
                    Dashboard
                </h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    {cardData.map((card, index) => (
                        <Link key={index} to={card.link}>
                            <Card>
                                <CardHeader className="text-center">
                                    <CardTitle>{card.title}</CardTitle>
                                    <CardDescription>
                                        {card.desc}
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        </Link>
                    ))}
                </div>
                <Calendar />
            </div>
        </Layout>
    );
}

export default Dashboard;
