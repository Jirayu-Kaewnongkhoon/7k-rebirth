import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router";

import { Avatar, Box, Button, Grid, List, ListItem, ListItemAvatar, ListItemText } from "@mui/material";

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

    const { data: leaderboards, isLoading, isError } = useQuery<LeaderBoardData[]>({
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
                <Grid container spacing={2}>
                    <Grid
                        size={{
                            xs: 12,
                            md: 8,
                        }}
                    >
                        <List>
                            {leaderboards?.map((leaderboard) => (
                                <ListItem
                                    key={leaderboard.id}
                                    sx={{
                                        '&:nth-of-type(even)': {
                                            backgroundColor: '#9e9e9e22'
                                        }
                                    }}
                                >
                                    <ListItemAvatar>
                                        <Avatar sizes="small">
                                            <pre>{leaderboard.boss.name}</pre>
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            new Intl.DateTimeFormat("th-TH", {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            }).format(new Date(leaderboard.date))
                                        }
                                        secondary={leaderboard._count.entries + ' รายการ'}
                                    />
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            gap: 1,
                                            justifyContent: 'space-around'
                                        }}>
                                        <Button
                                            variant="contained"
                                            size="small"
                                            color="primary"
                                            onClick={() => handleViewClick(leaderboard)}
                                        >
                                            View
                                        </Button>
                                        <Button
                                            variant="contained"
                                            size="small"
                                            color="error"
                                            onClick={() => mutation.mutate(leaderboard.id)}
                                        >
                                            Delete
                                        </Button>
                                    </Box>
                                </ListItem>
                            ))}
                        </List>
                    </Grid>
                </Grid>
            </div>
        </>
    )
}

export default LeaderBoardView