import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { useParams } from 'react-router';

import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

import ScoreGrowthChart from '../../components/ScoreGrowthChart/ScoreGrowthChart';

import { getBoss } from '../../services/castleBossService';
import { getEntriesByPlayer as getCastleEntriesByPlayer } from '../../services/castleEntryService';
import { getEntriesByPlayer as getGuildBossEntriesByPlayer } from '../../services/guildBossEntryService';
import { getPlayer } from '../../services/playerService';

import type { ICastleBoss, ICastleEntryWithLeaderboard } from '../../types/castle';
import type { IGuildBoss, IGuildBossEntryWithSeason } from '../../types/guildBoss';
import type { IPlayerWithStats } from '../../types/player';

import { scoreFormat } from '../../utils/score';
import { dateFormat } from '../../utils/date';
import { getGuildBoss } from '../../services/guildBossService';

function PlayerView() {
    const { id: playerId } = useParams();
    const { data: player, isLoading, isError } = useQuery<IPlayerWithStats>({
        queryKey: ['player', playerId],
        queryFn: () => getPlayer(Number(playerId!))
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
                <CastleChart playerId={Number(playerId!)} />
                <GuildBossChart playerId={Number(playerId!)} />
            </Grid >
        </>
    )
}

export default PlayerView

const CastleChart = ({ playerId }: { playerId: number; }) => {
    const [bossId, setBossId] = useState<number>(1);

    const { data: bossList } = useQuery<ICastleBoss[]>({
        queryKey: ['castle-boss'],
        queryFn: getBoss,
    });

    const { data: entries, isLoading } = useQuery<ICastleEntryWithLeaderboard[]>({
        queryKey: ['castle-entries', { playerId, bossId }],
        queryFn: () => getCastleEntriesByPlayer(playerId, bossId)
    });

    const handleBossChange = (e: SelectChangeEvent<number>) => {
        setBossId(e.target.value);
    }

    return (
        <Grid
            size={{ xs: 12, md: 8 }}
            sx={{
                borderRadius: 2,
                padding: 2,
                boxShadow: 'var(--box-shadow)',
            }}
        >
            <Box display='flex' justifyContent='space-between' alignItems='center'>
                <Typography variant="h6" fontWeight="bold">
                    คะแนนปราสาท
                </Typography>
                {bossList && (
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                        <Select
                            value={bossId}
                            onChange={handleBossChange}
                        >
                            {bossList?.map((boss) => (
                                <MenuItem key={boss.id} value={boss.id}>
                                    {boss.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )}
            </Box>
            <Divider sx={{ marginBlock: 2 }} />
            <ScoreGrowthChart
                loading={isLoading}
                dataset={entries ?? []}
                getXValue={(entry) => dateFormat(entry.leaderboard.date)}
                getYValue={(entry) => entry.score}
            />
        </Grid>
    )
}

const GuildBossChart = ({ playerId }: { playerId: number; }) => {
    const [bossId, setBossId] = useState<number>(5);

    const { data: bossList } = useQuery<IGuildBoss[]>({
        queryKey: ['guild-boss'],
        queryFn: getGuildBoss,
    });

    const { data: entries, isLoading } = useQuery<IGuildBossEntryWithSeason[]>({
        queryKey: ['guild-boss-entries', { playerId, bossId }],
        queryFn: () => getGuildBossEntriesByPlayer(playerId, bossId)
    });

    const handleBossChange = (e: SelectChangeEvent<number>) => {
        setBossId(e.target.value);
    }

    return (
        <Grid
            size={{ xs: 12, md: 8 }}
            sx={{
                borderRadius: 2,
                padding: 2,
                boxShadow: 'var(--box-shadow)',
            }}
        >
            <Box display='flex' justifyContent='space-between' alignItems='center'>
                <Typography variant="h6" fontWeight="bold">
                    คะแนนบอสจุติ
                </Typography>
                {bossList && (
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                        <Select
                            value={bossId}
                            onChange={handleBossChange}
                        >
                            {bossList?.map((boss) => (
                                <MenuItem key={boss.id} value={boss.id}>
                                    {boss.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )}
            </Box>
            <Divider sx={{ marginBlock: 2 }} />
            <ScoreGrowthChart
                loading={isLoading}
                dataset={entries ?? []}
                getXValue={(entry) => dateFormat(entry.season.startDate)}
                getYValue={(entry) => entry.score / entry.hits}
                yFormat={(val) => `${scoreFormat(val!)} (ต่อรอบ)`}
            />
        </Grid>
    )
}