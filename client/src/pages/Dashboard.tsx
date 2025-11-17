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
            desc: "View all activity proposals pending approval.",
            link: "/pending-apf",
            color: "bg-yellow-100 text-yellow-800",
        },
        {
            title: "Approved APF",
            desc: "View all approved activity proposals.",
            link: "/approved-apf",
            color: "bg-green-100 text-green-800",
        },
        {
            title: "Rejected APF",
            desc: "View all rejected activity proposals.",
            link: "/rejected-apf",
            color: "bg-red-100 text-red-800",
        },
    ];

    return (
        <Layout>
            <div className="p-6 space-y-6">
                <UserProfile />

                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-blue-800">
                        Dashboard
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Manage and monitor all activity proposals
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cardData.map((card, index) => (
                        <Link key={index} to={card.link}>
                            <Card className="hover:shadow-lg transition-all duration-200 rounded-xl">
                                <CardHeader className="text-center space-y-2">
                                    <CardTitle className="text-lg font-semibold">
                                        {card.title}
                                    </CardTitle>
                                    <CardDescription className="text-sm text-gray-600">
                                        {card.desc}
                                    </CardDescription>
                                    <div
                                        className={`mt-2 inline-block px-3 py-1 rounded-full text-sm font-medium ${card.color}`}
                                    >
                                        {card.title.split(" ")[0]}
                                    </div>
                                </CardHeader>
                            </Card>
                        </Link>
                    ))}
                </div>

                <Card className="p-4 mt-6">
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold">
                            Calendar
                        </CardTitle>
                        <CardDescription className="text-gray-500">
                            Overview of upcoming activities
                        </CardDescription>
                    </CardHeader>
                    <CardDescription className="mt-4">
                        <Calendar />
                    </CardDescription>
                </Card>
            </div>
        </Layout>
    );
}

export default Dashboard;
