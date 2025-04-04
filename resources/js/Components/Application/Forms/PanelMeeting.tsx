import { ApplicationFormProps, PanelMember } from "@/types";
import { Alert, Button, Card, CardBody, CardHeader, Chip, DatePicker, Divider, Input, TimeInput, User } from "@nextui-org/react";
import { DateValue, TimeValue } from "@react-types/datepicker";
import { CalendarDate, getLocalTimeZone, Time } from "@internationalized/date";
import React, { useEffect, useState } from "react";
import { ClipboardError, MdiAccountAdd, MdiCalendar, MdiDeleteForever, UserAlt } from "@/Components/Icons";

const PanelMeeting = ({user, application, status, handleUpdateApplication}: ApplicationFormProps) => {
    const [panelMembers, setPanelMembers] = useState<PanelMember[]>(application.panels ?? []);
    const [meeting, setMeeting] = useState<Date | null>(
        application.meeting ? new Date(application.meeting.meeting_date) : null
    );
    const [isDraft, setIsDraft] = useState(false);

    const dateFormat = Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        timeZone: getLocalTimeZone()
    });

    const handleSubmit = async () => {
        const data = {
            panel_members: JSON.stringify(panelMembers),
            meeting_date: meeting!.toISOString(),
        }

        try {
            const response = await window.axios.post(route('applications.assign-panel-meeting', {application: application}), data);

            handleUpdateApplication({
                application: {
                    panels: response.data.panels,
                    meeting: response.data.meeting,
                    statuses: [
                        { ...response.data.updated_status },
                        { ...response.data.new_status }
                    ]
                }
            });

            localStorage.removeItem("draft");
            setIsDraft(false);
        } catch (error: any) {
            console.error(error.response.data.message ?? 'An error occurred while assigning panel members and scheduling the meeting.');
        }
    }

    useEffect(() => {
        setPanelMembers(application.panels ?? []);
        setMeeting(application.meeting ? new Date(application.meeting.meeting_date) : null);
    }, [application.panels, application.meeting]);

    useEffect(() => {
        const draft = localStorage.getItem("draft");

        if (draft) {
            const draftData = JSON.parse(draft);

            setPanelMembers(draftData.panels);
            setMeeting(new Date(draftData.meeting));
            setIsDraft(true);
        }
    }, []);

    return (
        <Card className="sticky self-start top-0">
            <CardHeader className="flex-col items-start bg-success-300">
                <h3 className="text-xl font-semibold text-start">Reviewer and Meeting Schedule</h3>
                <p className="text-sm">
                    {user.role !== "staff"
                        ? "List of reviewer members and schedule of the meeting."
                        : "Assign reviewer members and schedule the meeting."
                    }
                </p>
            </CardHeader>
            <CardBody className="px-5">
                {status != null ? (
                    <>
                        {!status?.end ? (
                            <>
                                {(user.role == 'staff') ? (
                                    <PanelScheduleForm panelMembers={panelMembers}
                                                       meeting={meeting}
                                                       isDraft={isDraft}
                                                       setPanelMembers={setPanelMembers}
                                                       setMeeting={setMeeting}
                                                       setIsDraft={setIsDraft}
                                                       handleSubmit={handleSubmit}
                                    />
                                ) : (
                                    <p className="text-center text-medium p-5">
                                        Waiting for the staff to assign reviewers and schedule the meeting.
                                    </p>
                                )}
                            </>
                        ) : (
                            <div className="flex flex-col items-start gap-3 p-3">
                                <Alert title="Meeting Date"
                                       description={dateFormat.format(meeting!)}
                                       icon={<MdiCalendar/>}
                                />
                                <h3 className="text-lg">Reviewers</h3>
                                <div className="md:grid grid-cols-2 flex flex-col gap-2 w-full items-start justify-items-start">
                                    {panelMembers.map((panelMember, index) => {
                                        let panelName = `${panelMember.firstname} ${panelMember.lastname}`;

                                        if (user.role === 'researcher') {
                                            panelName = `Reviewer ${index + 1}`;
                                        }

                                        return (
                                            <User
                                                key={index}
                                                name={panelName}
                                                avatarProps={{
                                                    icon: <UserAlt/>,
                                                }}
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <p className="text-center text-medium p-5">
                        <ClipboardError className="w-12 h-12 text-default-400 mx-auto mb-3" />
                        <p className="text-default-500">
                            {user.role == 'researcher'
                                ? "Please upload the proof of payment receipt and must be confirmed by the RERC Staff."
                                : "The researchers proof of payment receipt must be confirmed before assigning panel members and scheduling the meeting."
                            }
                        </p>
                    </p>
                )}
            </CardBody>
        </Card>
    );
}

const PanelScheduleForm = ({
    panelMembers, meeting, isDraft, setPanelMembers, setMeeting, setIsDraft, handleSubmit
}: {
    panelMembers: PanelMember[],
    meeting: Date | null,
    isDraft: boolean,
    setPanelMembers: React.Dispatch<React.SetStateAction<PanelMember[]>>
    setMeeting: React.Dispatch<React.SetStateAction<Date | null>>,
    setIsDraft: React.Dispatch<React.SetStateAction<boolean>>,
    handleSubmit?: () => Promise<void>
}) => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    const [loading, setLoading] = useState(false);
    const [displayAlert, setDisplayAlert] = useState(false);

    const handleAddPanelMember = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const panelMember: PanelMember = {
            app_profile_id: "", id: "",
            firstname: firstName,
            lastname: lastName
        };

        setPanelMembers([...panelMembers, panelMember]);
    }

    const handleSetDate = (date: DateValue | null) => {
        if (date == null) {
            setMeeting(null);
        }

        setMeeting(date?.toDate(getLocalTimeZone()) ?? null);
    }

    const handleSetTime = (time: TimeValue | null) => {
        if (meeting == null || time == null) {
            return;
        }

        const newDate = new Date(meeting.getTime());

        newDate.setHours(time!.hour);
        newDate.setMinutes(time!.minute);

        setMeeting(newDate);
    }

    const handleRemovePanelMember = (index: number) => {
        const filtered = panelMembers.filter((_, i) => i !== index);

        setPanelMembers!(filtered);

        if (isDraft) {
            const draft = localStorage.getItem("draft");

            if (draft) {
                const draftData = JSON.parse(draft);

                draftData.panels = filtered;
                localStorage.setItem("draft", JSON.stringify(draftData));
            }
        }
    }

    const handleSaveDraft = () => {
        if (panelMembers.length === 0 || meeting == null) {
            return;
        }

        const draft = {
            panels: panelMembers,
            meeting: meeting.toISOString(),
        };

        localStorage.setItem("draft", JSON.stringify(draft));

        setDisplayAlert(true);
        setIsDraft(true);

        const timeout = setTimeout(() => {
            setDisplayAlert(false);
            clearTimeout(timeout);
        }, 4000);
    }

    const handleAssignPanelMeeting = () => {
        setLoading(true);

        handleSubmit!().finally(() => setLoading(false));
    }

    return (
        <>
            <div>
                <CardBody className="flex-row gap-3 items-center justify-between">
                    <div className="w-full">
                        <div className="flex flex-row items-center justify-between">
                            <h3 className="text-lg mb-2">Schedule Meeting</h3>
                            {isDraft && (
                                <Chip color="secondary" variant="shadow" size="sm" className="ml-auto">
                                    Draft
                                </Chip>
                            )}
                        </div>
                        <div className="flex flex-row gap-3">
                            <DatePicker
                                hideTimeZone
                                showMonthAndYearPickers
                                aria-labelledby="Meeting Date"
                                value={meeting ? new CalendarDate(meeting!.getFullYear(), meeting!.getMonth(), meeting!.getDate()): null}
                                onChange={handleSetDate}
                                className="max-w-[220px]"
                            />
                            <TimeInput
                                hideTimeZone
                                aria-labelledby="Meeting Time"
                                value={meeting ? new Time(meeting!.getHours(), meeting!.getMinutes()) : null}
                                onChange={handleSetTime}
                                className="max-w-[220px]"
                            />
                        </div>
                    </div>
                </CardBody>
            </div>
            <div>
                <CardHeader className="flex-col items-start">
                    <div className="flex flex-row items-center justify-between w-full">
                        <h3 className="text-lg">Assign Reviewers</h3>
                        {isDraft && (
                            <Chip color="secondary" variant="shadow" size="sm" className="ml-auto">
                                Draft
                            </Chip>
                        )}
                    </div>
                    <form className="flex flex-row items-center gap-3" onSubmit={handleAddPanelMember}>
                        <Input
                            isRequired
                            placeholder="First Name"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="max-w-[200px]"
                        />
                        <Input
                            isRequired
                            placeholder="Last Name"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="max-w-[200px]"
                        />
                        <Button isIconOnly color="primary" variant="light" radius="full" type="submit">
                            <MdiAccountAdd />
                        </Button>
                    </form>
                </CardHeader>
                <CardBody>
                    {panelMembers.length > 0 ? (
                        <div className="flex flex-col gap-2 my-2 max-h-[500px]">
                            {panelMembers.map((panelMember, index) => (
                                <div key={index} className="flex items-center justify-between gap-2">
                                    <User name={`${panelMember.firstname} ${panelMember.lastname}`}
                                          avatarProps={{icon: <UserAlt/>}}
                                    />
                                    <Button color="danger"
                                            variant="light"
                                            size="sm"
                                            onPress={() => handleRemovePanelMember(index)}
                                            isIconOnly
                                    >
                                        <MdiDeleteForever/>
                                    </Button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-medium mt-2">No panel members yet.</p>
                    )}
                </CardBody>
                <Divider className="my-4"/>
                <div className="flex flex-col items-center gap-3">
                    {displayAlert && (<Alert color="success" title="Draft Saved"/>)}
                    <div className="flex justify-end gap-3 w-full">
                        <Button color="secondary" variant="flat" onPress={() => handleSaveDraft()}>
                            Save as Draft
                        </Button>
                        <Button color="primary" isLoading={loading} onPress={handleAssignPanelMeeting}>
                            Assign and Schedule
                        </Button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default PanelMeeting;
