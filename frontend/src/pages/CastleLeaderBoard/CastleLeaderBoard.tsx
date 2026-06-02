import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router";

import localeTH from '@fullcalendar/core/locales/th';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { type DateClickArg } from "@fullcalendar/interaction";
import FullCalendar from '@fullcalendar/react';

import { getLeaderboards } from "../../services/castleLeaderboardService";

import type { ILeaderboardEvent } from "../../types/castle";

interface DateRange {
    start: string;
    end: string;
}

function CastleLeaderBoard() {
    const navigate = useNavigate();

    const [currentDate, setCurrentDate] = useState<DateRange | null>(null);

    const {
        data: leaderboards,
        isLoading,
        isError
    } = useQuery<ILeaderboardEvent[]>({
        queryKey: ['castle-leaderboards', currentDate],
        queryFn: () => getLeaderboards(currentDate!),
        enabled: currentDate !== null,
        placeholderData: (prev) => prev,
    });

    const handleDateClick = (arg: DateClickArg) => {
        navigate(`/leaderboard/${arg.dateStr}`);
    }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error loading leaderboards</div>;
    }

    return (
        <FullCalendar
            firstDay={0}
            locale={localeTH}
            contentHeight="auto"
            plugins={[dayGridPlugin, interactionPlugin]}
            dateClick={handleDateClick}
            events={leaderboards?.map(lb => ({
                id: lb.id.toString(),
                date: new Date(lb.date).toISOString().split('T')[0],
                display: lb._count.entries > 0 ? 'background' : 'none',
            })) || []}
            datesSet={(dateInfo) => {
                setCurrentDate({
                    start: dateInfo.startStr.split('T')[0],
                    end: dateInfo.endStr.split('T')[0]
                });
            }}
        />
    )
}

export default CastleLeaderBoard