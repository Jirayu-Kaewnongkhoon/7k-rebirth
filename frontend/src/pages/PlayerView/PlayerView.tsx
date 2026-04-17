import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router';

import { Divider, Grid, List, ListItem, ListItemText, Typography } from '@mui/material';

import { getPlayer } from '../../services/playerService';

import type { IPlayerWithStats } from '../../types/player';

function PlayerView() {
    const { id: playerId } = useParams();
    const { data: player, isLoading, isError } = useQuery<IPlayerWithStats>({
        queryKey: ['player', playerId],
        queryFn: () => getPlayer(Number(playerId)!)
    });

    const formatScore = (score: number) => {
        if (score >= 1_000_000) {
            return `${(score / 1_000_000).toFixed(2)}M`;
        } else if (score >= 1_000) {
            return `${(score / 1_000).toFixed(2)}K`;
        }
        return score.toString();
    };

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
            <Typography variant="h5" noWrap marginBlock={2}>
                สงครามชิงปราสาท
            </Typography>
            <Grid container spacing={2}>
                <Grid
                    size={{
                        xs: 12,
                        md: 8,
                    }}
                    sx={{
                        borderRadius: 2,
                        padding: 2,
                        boxShadow: 'var(--box-shadow)',
                    }}
                >
                    <List>
                        {player.stats.map((stat) => (
                            <ListItem
                                key={stat.id}
                                sx={{
                                    borderRadius: 1,
                                    '&:nth-of-type(even)': {
                                        backgroundColor: '#9e9e9e22'
                                    }
                                }}
                            >
                                <ListItemText
                                    primary={stat.boss.name}
                                    slotProps={{
                                        primary: {
                                            fontWeight: 'bold'
                                        }
                                    }}
                                />
                                <ListItemText
                                    primary={`คะแนนล่าสุด: ${formatScore(stat.lastScore)}`}
                                    secondary={`คะแนนสูงสุด: ${formatScore(stat.maxScore)}`}
                                    sx={{ textAlign: 'right' }}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Grid>
            </Grid >
        </>
    )
}

export default PlayerView