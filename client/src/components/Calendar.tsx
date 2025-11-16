import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useEffect, useState } from "react";
import type { Holiday } from "@/hooks/useHolidays";
import useHolidays from "@/hooks/useHolidays";
import useSchoolActivities, {
    type SchoolActivity,
} from "@/hooks/useSchoolActivities";
import type { EventClickArg } from "@fullcalendar/core/index.js";

interface Events {
    title: string;
    start: string;
    end?: string;
    allDay?: boolean;
    color?: string;
    extendedProps?: {
        organization?: string;
        venue?: string;
    };
}
const Modal = ({
    onClose,
    children,
}: {
    onClose: () => void;
    children: React.ReactNode;
}) => (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
        <div className="bg-white p-4 rounded shadow-lg w-96">
            {children}
            <button
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                onClick={onClose}
            >
                Close
            </button>
        </div>
    </div>
);

function Calendar() {
    const [events, setEvents] = useState<Events[]>([]);
    const [selectedActivity, setSelectedActivity] = useState<Events | null>(
        null
    );

    const { data: holidays } = useHolidays();
    const { data: schoolActivities } = useSchoolActivities();

    useEffect(() => {
        const mergedEvents: Events[] = [];

        if (holidays) {
            const mappedHolidays = holidays.map((holiday: Holiday) => ({
                title: holiday.name,
                start: holiday.date,
                allDay: true,
                color: "green",
            }));

            mergedEvents.push(...mappedHolidays);
        }

        if (schoolActivities) {
            const mappedSchoolActivities = schoolActivities.map(
                (activity: SchoolActivity) => {
                    const dateOnly = activity.date.split("T")[0];

                    return {
                        title: activity.title,
                        start: `${dateOnly}T${activity.startTime}`,
                        end: `${dateOnly}T${activity.endTime}`,
                        color: "blue",
                        extendedProps: {
                            organization: activity.organizationId.name,
                            venue: activity.venueId.name,
                        },
                    };
                }
            );

            mergedEvents.push(...mappedSchoolActivities);
        }

        setEvents(mergedEvents);
    }, [holidays, schoolActivities]);

    const handleEventClick = (info: EventClickArg) => {
        const { extendedProps, title, start, end } = info.event;

        // Only allow clicks for school activities (optional)
        if (extendedProps) {
            setSelectedActivity({
                title,
                start: start?.toISOString() || "",
                end: end?.toISOString() || "",
                extendedProps: extendedProps as {
                    organization: string;
                    venue: string;
                },
            });
        }
    };

    return (
        <>
            <FullCalendar
                initialView="dayGridMonth"
                plugins={[dayGridPlugin]}
                events={events}
                eventClick={handleEventClick}
            />

            {selectedActivity && (
                <Modal onClose={() => setSelectedActivity(null)}>
                    <h2 className="text-xl font-bold">
                        {selectedActivity.title}
                    </h2>
                    <p>
                        <strong>Organization:</strong>{" "}
                        {selectedActivity.extendedProps?.organization || "-"}
                    </p>
                    <p>
                        <strong>Venue:</strong>{" "}
                        {selectedActivity.extendedProps?.venue || "-"}
                    </p>
                    <p>
                        <strong>Start:</strong>{" "}
                        {selectedActivity.start
                            ? new Date(selectedActivity.start).toLocaleString()
                            : "-"}
                    </p>
                    <p>
                        <strong>End:</strong>{" "}
                        {selectedActivity.end
                            ? new Date(selectedActivity.end).toLocaleString()
                            : "-"}
                    </p>
                </Modal>
            )}
        </>
    );
}

export default Calendar;
