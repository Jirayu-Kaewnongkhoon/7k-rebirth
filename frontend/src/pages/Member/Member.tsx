import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router";

import { Box, Button } from "@mui/material";

import { deletePlayer, getPlayers } from "../../services/playerService";

import type { Player } from "../EntryView/EntyView";
import PlayerFormDialog from "../../components/PlayerFormDialog/PlayerFormDialog";

function Member() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: players, isLoading, isError } = useQuery<Player[]>({
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
            {players?.map(player => (
                <div
                    key={player.id}
                    style={{
                        border: '1px solid black',
                        margin: '10px',
                        padding: '10px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <p>{player.name}</p>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'space-around' }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => navigate(`/member/${player.id}`)}
                        >
                            View
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => mutation.mutate(player.id)}
                        >
                            Delete
                        </Button>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Member