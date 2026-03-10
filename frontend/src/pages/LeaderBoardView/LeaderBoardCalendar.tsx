import { useNavigate } from "react-router";

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin, { type DateClickArg } from "@fullcalendar/interaction"

function LeaderBoardCalendar() {
    const navigate = useNavigate();

    const handleDateClick = (arg: DateClickArg) => {
        navigate(`/leaderboard/${arg.dateStr}`);
    }

    return (
        <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            dateClick={handleDateClick}
        />
    )
}

export default LeaderBoardCalendar