import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { useNavigate, useParams } from "react-router";

import { CloudUpload, KeyboardArrowLeft, KeyboardArrowRight, Person, SaveAlt } from "@mui/icons-material";
import { Avatar, Box, Button, Grid, IconButton, List, ListItem, ListItemAvatar, ListItemText, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

import CastleEntryFormDialog, { type CastleEntryFormDialogHandle, type EntryInput } from "../../components/CastleEntryFormDialog/CastleEntryFormDialog";

import type { ICastleEntry, ICastleLeaderBoard } from "../../types/castle";

import { downloadJsonTemplate, getEntries } from "../../services/castleEntryService";
import { createLeaderboard, getLeaderboard } from "../../services/castleLeaderboardService";

import { dateFormat } from "../../utils/date";
import { scoreFormat } from "../../utils/score";

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

interface JsonData {
    leaderboardId: number;
    entries: EntryInput[];
}

function CastleEntry() {
    const { date } = useParams();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const dialogRef = useRef<CastleEntryFormDialogHandle>(null);

    const {
        data: leaderboard,
        isLoading: leaderboardLoading,
        isError: leaderboardError
    } = useQuery<ICastleLeaderBoard>({
        queryKey: ['castle-leaderboard', date],
        queryFn: () => getLeaderboard(date!),
    });

    const leaderboardMutation = useMutation({
        mutationFn: createLeaderboard,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['castle-leaderboard', date] });
        }
    });

    if (leaderboardLoading) {
        return <div>Loading...</div>;
    }

    if (leaderboardError) {
        return <div>Error loading leaderboard.</div>;
    }

    if (!leaderboard) {
        return (
            <Button
                variant="contained"
                onClick={() => {
                    leaderboardMutation.mutate(date!);
                }}
                loading={leaderboardMutation.isPending}
                loadingPosition="start"
            >
                เพิ่มหัวตาราง
            </Button>
        )
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target?.result as string;
                const jsonData = JSON.parse(content) as JsonData;
                dialogRef.current?.openWithEntries(jsonData.entries);
                event.target!.value = ''; // Reset the input
            } catch (error) {
                console.error('Error parsing JSON:', error);
            }
        };
        reader.readAsText(file);
    }

    const handleDownloadTemplate = async () => {
        try {
            const blob = await downloadJsonTemplate(leaderboard.id);

            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "template.json";
            a.click();

            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading template:', error);
        }
    }

    const goToDate = (direction: 'prev' | 'next') => {
        const dayOffset = direction === 'prev' ? -1 : 1;

        const date = new Date(leaderboard.date);
        date.setDate(date.getDate() + dayOffset);

        navigate(`/leaderboard/${date.toISOString().split('T')[0]}`);
    };

    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 2,
                    py: 2,
                    px: { xs: 1.5, sm: 2 },
                    borderRadius: 2,
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                }}
            >
                {/* Date navigator */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                    }}
                >
                    <IconButton
                        onClick={() => goToDate('prev')}
                        size="small"
                        sx={{
                            border: '1px solid',
                            borderColor: 'divider',
                            '&:hover': {
                                bgcolor: 'action.hover',
                                borderColor: 'primary.main',
                            },
                        }}
                    >
                        <KeyboardArrowLeft />
                    </IconButton>

                    <Typography
                        variant="h5"
                        fontWeight={600}
                        noWrap
                        sx={{ minWidth: 0, textAlign: 'center', px: 1.5 }}
                    >
                        {leaderboard.boss.name}
                        <Box component="span" sx={{ mx: 1.25, color: 'text.disabled' }}>
                            •
                        </Box>
                        <Box component="span" sx={{ color: 'text.secondary' }}>
                            {dateFormat(leaderboard.date)}
                        </Box>
                    </Typography>

                    <IconButton
                        onClick={() => goToDate('next')}
                        size="small"
                        sx={{
                            border: '1px solid',
                            borderColor: 'divider',
                            '&:hover': {
                                bgcolor: 'action.hover',
                                borderColor: 'primary.main',
                            },
                        }}
                    >
                        <KeyboardArrowRight />
                    </IconButton>
                </Box>

                {/* Actions */}
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={1}
                    sx={{ width: { xs: '100%', sm: 'auto' } }}
                >
                    <CastleEntryFormDialog leaderboardId={leaderboard.id} ref={dialogRef} />

                    <Button
                        component="label"
                        size="small"
                        variant="outlined"
                        tabIndex={-1}
                        startIcon={<CloudUpload />}
                    >
                        JSON file
                        <VisuallyHiddenInput
                            type="file"
                            accept="application/json"
                            onChange={handleFileChange}
                        />
                    </Button>

                    <Button
                        size="small"
                        variant="outlined"
                        startIcon={<SaveAlt />}
                        onClick={handleDownloadTemplate}
                    >
                        JSON Template
                    </Button>
                </Stack>
            </Box>

            <Entries id={leaderboard.id} />
        </>
    )
}

export default CastleEntry

function Entries({ id }: { id: number }) {

    const {
        data: entries,
        isLoading: entriesLoading,
        isError: entriesError
    } = useQuery<ICastleEntry[]>({
        queryKey: ['castle-entries', id],
        queryFn: () => getEntries(id!),
        enabled: !!id
    });

    const total = entries?.reduce((sum, entry) => sum + entry.score, 0) ?? 0;

    if (entriesLoading) {
        return <div>Loading...</div>;
    }

    if (entriesError) {
        return <div>Error loading entries.</div>;
    }

    return (
        <Box marginBlock={2}>
            <Box sx={{ display: 'flex', alignItems: { sm: 'center' }, flexDirection: { xs: 'column', sm: 'row' }, gap: 1 }}>
                <Typography variant="h5" noWrap>
                    {`อันดับคะแนน (${entries?.filter(e => e.score !== 0).length} รายการ)`}
                </Typography>
                <Typography variant="h5" sx={{ display: { xs: 'none', sm: 'block' } }}>|</Typography>
                <Typography variant="h5" noWrap>
                    {`คะแนนรวม : ${total.toLocaleString()}`}
                </Typography>
            </Box>
            <Grid container spacing={2}>
                <Grid
                    size={{
                        xs: 12,
                        md: 8,
                    }}
                >
                    {entries?.length === 0 ? (
                        <Typography variant="body1" color="text.secondary" textAlign="center" padding={8}>
                            ยังไม่มีข้อมูลสถิติ
                        </Typography>
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
                                        secondary={entry.state}
                                    />
                                    <Typography>{scoreFormat(entry.score)}</Typography>
                                </ListItem>
                            ))}
                        </List>
                    )}
                </Grid>
            </Grid>
        </Box>
    )
}