import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";

import { Delete, Person } from "@mui/icons-material";
import { Avatar, Box, Grid, IconButton, List, ListItemAvatar, ListItemButton, ListItemText, Typography } from "@mui/material";

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

    const totalPlayers = players?.filter(player => player.isActive).length || 0;

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
                <Typography variant="h5" noWrap>รายชื่อสมาชิก ({totalPlayers} คน)</Typography>
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
                            <ListItemButton
                                key={player.id}
                                sx={{
                                    borderRadius: 1,
                                    '&:nth-of-type(even)': {
                                        backgroundColor: '#9e9e9e22'
                                    },
                                    "&:hover": {
                                        backgroundColor: "rgba(146, 188, 255, 0.1)",
                                    }
                                }}
                                onClick={() => navigate(`/member/${player.id}`)}
                            >
                                <ListItemAvatar>
                                    <Avatar>
                                        <Person />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={player.name}
                                    secondary={!player.isActive && 'Inactive'}
                                />

                                <IconButton
                                    disabled={!player.isActive}
                                    loading={mutation.isPending && mutation.variables === player.id}
                                    size="small"
                                    color="error"
                                    onClick={() => mutation.mutate(player.id)}
                                >
                                    <Delete />
                                </IconButton>
                            </ListItemButton>
                        ))}
                    </List>
                </Grid>
            </Grid>
        </div>
    )
}

export default Member