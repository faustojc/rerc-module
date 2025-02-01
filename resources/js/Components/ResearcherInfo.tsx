import React from "react";
import { Member } from "@/types";
import { Avatar, Tooltip } from "@nextui-org/react";

const ResearcherInfo: React.FC<{
    mainResearcher: {
        firstname: string;
        lastname: string;
    };
    members: Member[];
}> = ({
    mainResearcher,
    members,
}) => {
    const isNotMainResearcher = (member: Member) =>
        member.firstname !== mainResearcher.firstname && member.lastname !== mainResearcher.lastname;

    const getInitials = (firstname: string, lastname: string) =>
        `${firstname[0]}${lastname[0]}`.toUpperCase();

    return (
        <div className="flex items-center space-x-2">
            <Avatar
                name={getInitials(mainResearcher.firstname, mainResearcher.lastname)}
                size="sm"
                color="primary"
            />
            <div>
                <p className="font-medium">
                    {`${mainResearcher.firstname} ${mainResearcher.lastname}`}
                </p>
                <p className="text-sm text-gray-500">Main Researcher</p>
            </div>
            {members.length > 0 && (
                <div className="flex -space-x-2 ml-4">
                    {members.filter((member) => isNotMainResearcher(member)).map((member) => (
                        <Tooltip key={member.id} content={`${member.firstname} ${member.lastname}`}>
                            <Avatar
                                name={getInitials(member.firstname, member.lastname)}
                                size="sm"
                                className="border-2 border-white"
                            />
                        </Tooltip>
                    ))}
                    {members.length > 3 && (
                        <Tooltip content={members.slice(3).map(m =>
                            `${m.firstname} ${m.lastname}`
                        ).join(', ')}
                        >
                            <Avatar
                                name={`+${members.length - 3}`}
                                size="sm"
                                className="border-2 border-white bg-default-200"
                            />
                        </Tooltip>
                    )}
                </div>
            )}
        </div>
    );
};

export default ResearcherInfo;
