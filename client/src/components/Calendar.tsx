import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useEffect, useState } from "react";
import type { Holiday } from "@/hooks/useHolidays";
import useHolidays from "@/hooks/useHolidays";
import useSchoolActivities, {
    type SchoolActivity,
} from "@/hooks/useSchoolActivities";
import type { EventClickArg } from "@fullcalendar/core";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Events {
    title: string;
    start: string;
    end?: string;
    allDay?: boolean;
    color?: string;
    extendedProps?: {
        organization?: string;
        venue?: string;
        type?: string;
    };
}

function Calendar() {
    const { data: holidays } = useHolidays();
    const { data: schoolActivities } = useSchoolActivities();

    const [events, setEvents] = useState<Events[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<Events | null>(null);
    const [openDialog, setOpenDialog] = useState<boolean>(false);

    useEffect(() => {
        const mergedEvents: Events[] = [];

        if (holidays) {
            mergedEvents.push(
                ...holidays.map((holiday: Holiday) => ({
                    title: holiday.name,
                    start: holiday.date,
                    end: holiday.date,
                    allDay: true,
                    color: "#34D399",
                    extendedProps: { type: "Holiday" },
                }))
            );
        }

        if (schoolActivities) {
            mergedEvents.push(
                ...schoolActivities.map((activity: SchoolActivity) => {
                    const dateOnly = activity.date.split("T")[0];
                    return {
                        title: activity.title,
                        start: `${dateOnly}T${activity.startTime}`,
                        end: `${dateOnly}T${activity.endTime}`,
                        color: "#3B82F6",
                        extendedProps: {
                            organization: activity.organizationId.name,
                            venue: activity.venueId.name,
                            type: "Activity",
                        },
                    };
                })
            );
        }

        setEvents(mergedEvents);
    }, [holidays, schoolActivities]);

    const handleEventClick = (info: EventClickArg) => {
        const { extendedProps, title, start, end } = info.event;
        if (extendedProps) {
            setSelectedEvent({
                title,
                start: start?.toISOString() || "",
                end: end?.toISOString() || "",
                extendedProps: extendedProps as {
                    organization: string;
                    venue: string;
                    type: "Holiday" | "Activity";
                },
            });
            setOpenDialog(true);
        }
    };

    return (
        <>
            <div className="border rounded-lg shadow-sm overflow-hidden">
                <FullCalendar
                    initialView="dayGridMonth"
                    plugins={[dayGridPlugin]}
                    events={events}
                    eventClick={handleEventClick}
                    height="auto"
                />
            </div>

            {selectedEvent && (
                <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                    <DialogContent className="max-w-md rounded-xl shadow-lg">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold text-blue-700">
                                {selectedEvent.title}
                            </DialogTitle>
                            <DialogDescription className="text-gray-600">
                                {selectedEvent.extendedProps?.type === "Holiday"
                                    ? "This is a school holiday."
                                    : "Details of the scheduled activity."}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="mt-4 space-y-4">
                            {selectedEvent.extendedProps?.organization && (
                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        Organization
                                    </p>
                                    <p className="text-base text-gray-800">
                                        {
                                            selectedEvent.extendedProps
                                                .organization
                                        }
                                    </p>
                                </div>
                            )}

                            {selectedEvent.extendedProps?.venue && (
                                <div>
                                    <p className="text-sm font-medium text-gray-500">
                                        Venue
                                    </p>
                                    <p className="text-base text-gray-800">
                                        {selectedEvent.extendedProps.venue}
                                    </p>
                                </div>
                            )}

                            <div>
                                <p className="text-sm font-medium text-gray-500">
                                    Start Date & Time
                                </p>
                                <p className="text-base text-gray-800">
                                    {new Date(
                                        selectedEvent.start
                                    ).toLocaleString()}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm font-medium text-gray-500">
                                    End Date & Time
                                </p>
                                <p className="text-base text-gray-800">
                                    {selectedEvent.end
                                        ? new Date(
                                              selectedEvent.end
                                          ).toLocaleString()
                                        : "N/A"}
                                </p>
                            </div>
                        </div>

                        <DialogFooter className="mt-6 flex justify-end">
                            <DialogClose asChild>
                                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition">
                                    Close
                                </Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
}

export default Calendar;
