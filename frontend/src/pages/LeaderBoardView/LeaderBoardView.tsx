import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router";

import { Button } from "@mui/material";

import LeaderboardFormDialog from "../../components/LeaderBoardFormDialog/LeaderBoardFormDialog";

import { deleteLeaderboard, getLeaderboards } from "../../services/leaderboardService"

export interface LeaderBoardData {
    id: number;
    boss: {
        name: string;
    };
    _count: {
        entries: number;
    };
    date: string;
}

function LeaderBoardView() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { data, isLoading, isError } = useQuery<LeaderBoardData[]>({
        queryKey: ['leaderboards'],
        queryFn: getLeaderboards
    });

    const mutation = useMutation({
        mutationFn: deleteLeaderboard,
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['leaderboards'] })
        },
    })

    const handleViewClick = (leaderboard: LeaderBoardData) => navigate({
        pathname: `/leaderboard/${leaderboard.id}`,
        search: `?date=${new Date(leaderboard.date).toLocaleDateString()}&bossName=${leaderboard.boss.name}`
    })

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error loading leaderboards.</div>;
    }

    return (
        <>
            <LeaderboardFormDialog />
            <div>
                {data?.map((leaderboard: LeaderBoardData) => (
                    <div
                        key={leaderboard.id}
                        style={{
                            border: '1px solid black',
                            margin: '10px',
                            padding: '10px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <div>
                            <h3>{new Date(leaderboard.date).toLocaleDateString()} - {leaderboard.boss.name}</h3>
                            <p>{leaderboard._count.entries} entries</p>
                        </div>
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'space-around' }}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleViewClick(leaderboard)}
                            >
                                View
                            </Button>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={() => mutation.mutate(leaderboard.id)}
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}

export default LeaderBoardView