import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useParams } from "react-router";

import { ExpandLess, ExpandMore, Person } from "@mui/icons-material";
import { Avatar, Box, Collapse, Divider, Grid, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Skeleton, Typography } from "@mui/material";

import GuildBossEntryFormDialog from "../../components/GuildBossEntryFormDialog/GuildBossEntryFormDialog";
import HitsSummaryDialog from "../../components/HitsSummaryDialog/HitsSummaryDialog";

import type { IGuildBoss, IGuildBossEntry, IGuildBossSeason } from "../../types/guildBoss";

import { getEntries } from "../../services/guildBossEntryService";
import { getGuildBoss, getSeason } from "../../services/guildBossService";

import { dateFormat } from "../../utils/date";
import { scoreFormat } from "../../utils/score";

function GuildBossEntry() {
    const { id } = useParams();
    const seasonId = parseInt(id!);

    const {
        data: season,
        isLoading,
        isError
    } = useQuery<IGuildBossSeason>({
        queryKey: ['guild-boss-season', seasonId],
        queryFn: () => getSeason(seasonId),
    });

    const { data: boss } = useQuery<IGuildBoss[]>({
        queryKey: ['guild-boss'],
        queryFn: getGuildBoss
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error loading season.</div>;
    }

    if (!season) {
        return <div>season notfound</div>
    }

    if (boss == undefined) {
        return <div>boss not found</div>
    }

    return (
        <>
            <Typography variant="h4" component="h1" gutterBottom>
                วันที่: {dateFormat(season.startDate)} - {dateFormat(season.endDate)}
            </Typography>
            <Divider />
            <HitsSummaryDialog seasonId={seasonId} />
            {boss.map(b => (
                <Entry key={b.id} seasonId={seasonId} boss={b} />
            ))}
        </>
    )
}

export default GuildBossEntry

function Entry({
    seasonId,
    boss
}: {
    seasonId: number
    boss: IGuildBoss
}) {

    const { data: entries, isLoading, isError } = useQuery<IGuildBossEntry[]>({
        queryKey: ['guild-boss-entries', { seasonId, bossId: boss.id }],
        queryFn: () => getEntries(seasonId, boss.id),
    });

    const [open, setOpen] = useState(false);

    const totalScore = entries?.reduce((sum, entry) => sum + entry.score, 0) ?? 0;

    const handleClick = () => setOpen(!open);

    if (isLoading) {
        return (
            <Skeleton
                animation="wave"
                variant="rounded"
                width="65%"
                height="48px"
                sx={{ marginBlock: 1.8 }}
            />
        );
    }

    if (isError) {
        return <div>Error loading season.</div>;
    }

    return (
        <Box marginBlock={2}>
            <Grid container spacing={2}>
                <Grid
                    size={{
                        xs: 12,
                        md: 8,
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ListItemButton
                            onClick={handleClick}
                            sx={{
                                border: (theme) =>
                                    theme.palette.mode === 'dark' ? '1px solid rgba(255,255,255,0.12)' : 'none',
                                boxShadow: (theme) =>
                                    theme.palette.mode === 'dark' ? 'none' : 'var(--box-shadow)',
                            }}>
                            <ListItemText primary={`บอส${boss.name}`} />
                            {open ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                        <GuildBossEntryFormDialog seasonId={seasonId} boss={boss} scoreList={entries ?? []} />
                    </Box>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        {entries?.length == 0 ? (
                            <Typography variant="body1" noWrap textAlign="center" padding={2}>
                                ยังไม่มีข้อมูลสถิติ
                            </Typography>
                        ) : (
                            <List>
                                <Typography variant="body1" sx={{ paddingX: 2, paddingY: 1, fontWeight: 'bold' }}>
                                    {`คะแนนรวม : ${scoreFormat(totalScore)}`}
                                </Typography>
                                {entries?.map((entry, index) => (
                                    <ListItem
                                        key={entry.id}
                                        sx={{
                                            '&:nth-of-type(even)': {
                                                backgroundColor: 'action.selected'
                                            }
                                        }}
                                    >
                                        <ListItemAvatar>
                                            <Avatar>
                                                <Person />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={`${index + 1}. ${entry.player.name}`}
                                            secondary={`คะแนนต่อรอบ: ${scoreFormat(entry.score / entry.hits)}`}
                                        />
                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: "flex-end" }}>
                                            <Typography>คะแนน: {scoreFormat(entry.score)}</Typography>
                                            <Typography>รอบตี: {entry.hits}</Typography>
                                        </Box>
                                    </ListItem>
                                ))}
                            </List>
                        )}
                    </Collapse>
                </Grid>
            </Grid>
        </Box>
    )
}