import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router'

import { Avatar, Divider, Grid, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';

import { getPlayer } from '../../services/playerService';

import type { Player } from '../EntryView/EntyView';

function PlayerView() {
    const { id: playerId } = useParams();
    const { data: player, isLoading, isError } = useQuery<Player>({
        queryKey: ['player', playerId],
        queryFn: () => getPlayer(Number(playerId)!)
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error loading player.</div>;
    }

    if (!player || !player?.isActive) {
        return <>player not found</>
    }

    return (
        <>
            <h2>{player?.name}</h2>
            <Divider />
            <h3>Stats</h3>
            <Grid container spacing={2}>
                <Grid
                    size={{
                        xs: 12,
                        md: 8,
                    }}
                >
                    <List>
                        {player.stats.map((stat) => (
                            <ListItem
                                key={stat.id}
                                sx={{
                                    '&:nth-of-type(even)': {
                                        backgroundColor: '#9e9e9e22'
                                    }
                                }}
                            >
                                <ListItemAvatar>
                                    <Avatar sizes="small">
                                        <pre>{stat.boss.name}</pre>
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={`Last Score: ${stat.lastScore}`}
                                    secondary={`Max Score: ${stat.maxScore}`}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Grid>
            </Grid>
        </>
    )
}

export default PlayerView