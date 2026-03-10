import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router";

import { Avatar, Box, Button, Dialog, DialogContent, DialogTitle, Divider, Grid, List, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { CloudUpload, Person, Save, SaveAlt } from "@mui/icons-material";

import EntryFormDialogCalendar from "../../components/EntryFormDialog/EntryFormDialogCalendar";

import { createEntriesJson, getEntries } from "../../services/entryService";
import { getLeaderboard } from "../../services/leaderboardService";

import type { Boss } from "../../components/LeaderBoardFormDialog/LeaderBoardFormDialog";

export interface LeaderBoardData {
    id: number;
    boss: {
        name: string;
    };
    date: string;
}

export interface Entry {
    id: number;
    player: Player;
    score: number;
    state: string;
}

export interface Player {
    id: number;
    name: string;
    isActive: boolean;
    stats: PlayerBossStats[]
}

export interface PlayerBossStats {
    id: number
    playerId: number
    bossId: number
    boss: Boss
    maxScore: number
    lastScore: number
}

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

function EntryCalendar() {
    const { date } = useParams();
    const queryClient = useQueryClient();

    const [file, setFile] = useState<File | null>(null);
    const [previewFile, setPreviewFile] = useState(null);

    const {
        data: leaderboard,
        isLoading: leaderboardLoading,
        isError: leaderboardError
    } = useQuery<LeaderBoardData>({
        queryKey: ['leaderboard', date],
        queryFn: () => getLeaderboard(date!),
    });

    const mutation = useMutation({
        mutationFn: createEntriesJson,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['entries', leaderboard?.id] });
            setFile(null);
        }
    });

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setFile(file);

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const content = e.target?.result as string;
                const jsonData = JSON.parse(content);
                console.log(jsonData);
                setPreviewFile(jsonData);
                event.target!.value = ''; // Reset the input
            } catch (error) {
                console.error('Error parsing JSON:', error);
            }
        };
        reader.readAsText(file);
    }

    const handleConfirmUpload = () => {
        const formData = new FormData();
        formData.append('file', file!);
        mutation.mutate(formData);
    }

    const handleDownloadTemplate = () => {
        // TODO: load template with leaderboardId
    }

    if (leaderboardLoading) {
        return <div>Loading...</div>;
    }

    if (leaderboardError || !leaderboard) {
        return <div>Error loading leaderboard.</div>;
    }

    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingBlock: 2
                }}
            >
                <Box>
                    <Typography variant="h4" noWrap>
                        Date : {
                            new Intl.DateTimeFormat("th-TH", {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                            }).format(new Date(leaderboard?.date!))
                        }
                    </Typography>
                    <Typography variant="h4" noWrap>
                        Boss : {leaderboard?.boss.name}
                    </Typography>
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1
                    }}
                >
                    <EntryFormDialogCalendar leaderboardId={leaderboard?.id!} />
                    <Button
                        component="label"
                        size="small"
                        variant="contained"
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
                        variant="contained"
                        startIcon={<SaveAlt />}
                        onClick={handleDownloadTemplate}
                    >
                        JSON Template
                    </Button>
                </Box>
            </Box>

            <Divider />

            <Entries id={leaderboard?.id!} />

            <Dialog
                open={file !== null}
                onClose={() => setFile(null)}
            >
                <DialogTitle>Preview Uploaded File</DialogTitle>
                <DialogContent>
                    <pre>{JSON.stringify(previewFile, null, 2)}</pre>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleConfirmUpload}
                        loading={mutation.isPending}
                        loadingPosition="start"
                        startIcon={<Save />}
                    >
                        Confirm Upload
                    </Button>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default EntryCalendar

function Entries({ id }: { id: number }) {

    const {
        data: entries,
        isLoading: entriesLoading,
        isError: entriesError
    } = useQuery<Entry[]>({
        queryKey: ['entries', id],
        queryFn: () => getEntries(id!.toString()),
        enabled: !!id
    });

    if (entriesLoading) {
        return <div>Loading...</div>;
    }

    if (entriesError) {
        return <div>Error loading entries.</div>;
    }

    return (
        <Box marginBlock={2}>
            <Typography variant="h5" noWrap>
                {`อันดับคะแนน (${entries?.length} รายการ)`}
            </Typography>
            <Grid container spacing={2}>
                <Grid
                    size={{
                        xs: 12,
                        md: 8,
                    }}
                >
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
                                <Typography>{entry.score}</Typography>
                            </ListItem>
                        ))}
                    </List>
                </Grid>
            </Grid>
        </Box>
    )
}