import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import Layout from "@/layouts/Layout";
import UserProfile from "@/components/UserProfile";
import Calendar from "@/components/Calendar";

function Dashboard() {
    const cardData = [
        {
            title: "Submitted APF",
            desc: "This is the submitted APF.",
        },
        {
            title: "Approved APF",
            desc: "This is the approved APF.",
        },
        {
            title: "Rejected APF",
            desc: "This is the rejected APF.",
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
                    {cardData.map((card) => (
                        <Card>
                            <CardHeader className="text-center">
                                <CardTitle>{card.title}</CardTitle>
                                <CardDescription>{card.desc}</CardDescription>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
                <Calendar />
            </div>
        </Layout>
    );
}

export default Dashboard;
