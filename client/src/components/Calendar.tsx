import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { useEffect, useState } from "react";
import type { Holiday } from "@/hooks/useHolidays";
import useHolidays from "@/hooks/useHolidays";
import useSchoolActivities, {
    type SchoolActivity,
} from "@/hooks/useSchoolActivities";
import type { EventClickArg } from "@fullcalendar/core/index.js";
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
            const mappedHolidays = holidays.map((holiday: Holiday) => ({
                title: holiday.name,
                start: holiday.date,
                end: holiday.date,
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
            setSelectedEvent({
                title,
                start: start?.toISOString() || "",
                end: end?.toISOString() || "",
                extendedProps: extendedProps as {
                    organization: string;
                    venue: string;
                },
            });
            setOpenDialog(true);
        }
    };

    return (
        <>
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <FullCalendar
                    initialView="dayGridMonth"
                    plugins={[dayGridPlugin]}
                    events={events}
                    eventClick={handleEventClick}
                />

                {selectedEvent && (
                    <DialogContent className="max-w-lg">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-semibold">
                                Activity Details
                            </DialogTitle>
                            <DialogDescription className="text-base">
                                Below is the complete information about the
                                selected activity.
                            </DialogDescription>
                        </DialogHeader>

                        <div className="mt-4 space-y-6">
                            <div>
                                <h3 className="text-lg font-bold text-blue-700">
                                    {selectedEvent.title}
                                </h3>
                            </div>

                            <hr className="border-gray-300" />

                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">
                                        Organization
                                    </p>
                                    <p className="text-base">
                                        {selectedEvent.extendedProps
                                            ?.organization || "N/A"}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-gray-600">
                                        Venue
                                    </p>
                                    <p className="text-base">
                                        {selectedEvent.extendedProps?.venue ||
                                            "N/A"}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-gray-600">
                                        Start Date & Time
                                    </p>
                                    <p className="text-base">
                                        {new Date(
                                            selectedEvent.start
                                        ).toLocaleString()}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-gray-600">
                                        End Date & Time
                                    </p>
                                    <p className="text-base">
                                        {selectedEvent.end
                                            ? new Date(
                                                  selectedEvent.end
                                              ).toLocaleString()
                                            : "N/A"}
                                    </p>
                                </div>
                            </div>

                            <hr className="border-gray-300" />
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition">
                                    Close
                                </Button>
                            </DialogClose>
                        </DialogFooter>
                    </DialogContent>
                )}
            </Dialog>
        </>
    );
}

export default Calendar;
