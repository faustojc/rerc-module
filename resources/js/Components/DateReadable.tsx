import { formatDistanceToNow } from "date-fns";
import React, { useEffect, useState } from "react";

interface DateReadableProps extends React.HTMLAttributes<HTMLTimeElement> {
    date: Date;
}

const DateReadable: React.FC<DateReadableProps> = ({ date, ...props }) => {
    const [relativeDate, setRelativeDate] = useState<string>(formatDistanceToNow(date, {addSuffix: true}));

    useEffect(() => {
        const intervalId = setInterval(() => {
            setRelativeDate(formatDistanceToNow(date, {addSuffix: true}));
        }, 60000);

        return () => clearInterval(intervalId);
    }, [date]);

    return <time {...props}>{relativeDate}</time>;
};

export default DateReadable;
