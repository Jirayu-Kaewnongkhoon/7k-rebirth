import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router';

import { Divider, Grid, List, ListItem, ListItemText, Typography } from '@mui/material';

import { getPlayer } from '../../services/playerService';

import type { IPlayerWithStats } from '../../types/player';

import { scoreFormat } from '../../utils/score';

function PlayerView() {
    const { id: playerId } = useParams();
    const { data: player, isLoading, isError } = useQuery<IPlayerWithStats>({
        queryKey: ['player', playerId],
        queryFn: () => getPlayer(Number(playerId)!)
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error loading player.</div>;
    }

    if (!player || !player.isActive) {
        return <>player not found</>
    }

    return (
        <>
            <h2>{player.name}</h2>
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
                    {player.stats.length === 0 ? (
                        <Typography variant="body1" color="text.secondary" textAlign="center" padding={2}>
                            ยังไม่มีข้อมูลสถิติ
                        </Typography>
                    ) : (
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
                                        primary={`คะแนนล่าสุด: ${scoreFormat(stat.lastScore)}`}
                                        secondary={`คะแนนสูงสุด: ${scoreFormat(stat.maxScore)}`}
                                        sx={{ textAlign: 'right' }}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    )}
                </Grid>
            </Grid >
        </>
    )
}

export default PlayerView