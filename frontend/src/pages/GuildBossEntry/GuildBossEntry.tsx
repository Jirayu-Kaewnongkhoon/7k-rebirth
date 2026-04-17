import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useParams } from "react-router";

import { ExpandLess, ExpandMore, Person } from "@mui/icons-material";
import { Avatar, Box, Collapse, Grid, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Skeleton, Typography } from "@mui/material";

import GuildBossEntryFormDialog from "../../components/GuildBossEntryFormDialog/GuildBossEntryFormDialog";

import type { IGuildBoss, IGuildBossEntry } from "../../types/guildBoss";

import { getEntries } from "../../services/guildBossEntryService";
import { getGuildBoss, getSeason } from "../../services/guildBossService";

function GuildBossEntry() {
    const { id } = useParams();

    if (!id || Number.isNaN(Number(id))) return <div>invalid id</div>

    const {
        data: season,
        isLoading,
        isError
    } = useQuery<IGuildBossEntry>({
        queryKey: ['guild-boss-season', parseInt(id)],
        queryFn: () => getSeason(parseInt(id)),
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
            <div>GuildBossEntry: {id}</div>

            {boss.map(b => (
                <Entry key={b.id} seasonId={parseInt(id)} boss={b} />
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

    const handleClick = () => setOpen(!open);

    if (isLoading) {
        return (
            <Skeleton
                animation="wave"
                variant="rounded"
                width="60%"
                height="30%"
                sx={{ marginBlock: 2 }}
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
                                boxShadow: 'var(--box-shadow)',
                                borderRadius: 1
                            }}>
                            <ListItemText primary={`บอส${boss.name}`} />
                            {open ? <ExpandLess /> : <ExpandMore />}
                        </ListItemButton>
                        <GuildBossEntryFormDialog seasonId={seasonId} boss={boss} scoreList={entries || []} />
                    </Box>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        {entries?.length == 0 ? (
                            <Typography variant="h6" noWrap textAlign="center">no data</Typography>
                        ) : (
                            <List>
                                {entries?.map((entry) => (
                                    <ListItem
                                        key={entry.id}
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
                                        <ListItemText
                                            primary={entry.player.name}
                                            secondary={`คะแนนต่อรอบ: ${entry.score / entry.hits}`}
                                        />
                                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: "flex-end" }}>
                                            <Typography>คะแนน: {entry.score}</Typography>
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