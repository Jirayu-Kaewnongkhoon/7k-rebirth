import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router";

import { Avatar, Box, Button, Grid, List, ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import { Person } from "@mui/icons-material";

import PlayerFormDialog from "../../components/PlayerFormDialog/PlayerFormDialog";

import { deletePlayer, getPlayers } from "../../services/playerService";

import type { IPlayer } from "../../types/player";

function Member() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: players, isLoading, isError } = useQuery<IPlayer[]>({
        queryKey: ['players'],
        queryFn: getPlayers,
    });

    const mutation = useMutation({
        mutationFn: deletePlayer,
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['players'] })
        },
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error loading players.</div>;
    }

    return (
        <div>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}
            >
                <h2>รายชื่อสมาชิก</h2>
                <PlayerFormDialog />
            </Box>
            <Grid container spacing={2}>
                <Grid
                    size={{
                        xs: 12,
                        md: 8,
                    }}
                >
                    <List>
                        {players?.map((player) => (
                            <ListItem
                                key={player.id}
                                sx={{
                                    '&:nth-of-type(even)': {
                                        backgroundColor: '#9e9e9e22'
                                    }
                                }}
                            >
                                <ListItemAvatar>
                                    <Avatar>
                                        <Person />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary={player.name} />
                                <Box
                                    sx={{
                                        display: 'flex',
                                        gap: '10px',
                                        justifyContent: 'space-around'
                                    }}
                                >
                                    <Button
                                        size="small"
                                        variant="contained"
                                        color="primary"
                                        onClick={() => navigate(`/member/${player.id}`)}
                                    >
                                        View
                                    </Button>
                                    <Button
                                        size="small"
                                        variant="contained"
                                        color="error"
                                        onClick={() => mutation.mutate(player.id)}
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
    )
}

export default Member