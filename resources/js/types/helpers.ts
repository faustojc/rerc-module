export const statusColor = (status: string) => {
    if ('pending'.includes(status.toLowerCase())) {
        return "warning";
    } else if ('approved,completed,submitted,done,assigned,signed'.includes(status.toLowerCase())) {
        return "success";
    } else if ('sent,received,reviewed,reviewing,uploaded'.includes(status.toLowerCase())) {
        return "secondary";
    } else if ('rejected,removed'.includes(status.toLowerCase())) {
        return "danger";
    } else {
        return "primary";
    }
};
