import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useSearchParams } from "react-router";

import { Avatar, Box, Button, Dialog, DialogContent, DialogTitle, Grid, IconButton, List, ListItem, ListItemAvatar, ListItemText, Tooltip, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { CloudUpload, Person, Save, SaveAlt } from "@mui/icons-material";

import EntryFormDialog from "../../components/EntryFormDialog/EntryFormDialog";

import { createEntriesJson, getEntries } from "../../services/entryService";

import type { Boss } from "../../components/LeaderBoardFormDialog/LeaderBoardFormDialog";

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

function EntryView() {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const queryClient = useQueryClient();

    const bossName = searchParams.get('bossName');
    const date = searchParams.get('date');
    const [file, setFile] = useState<File | null>(null);
    const [previewFile, setPreviewFile] = useState(null);

    const { data: scoreList, isLoading, isError } = useQuery<Entry[]>({
        queryKey: ['entries'],
        queryFn: () => getEntries(id!)
    });

    const mutation = useMutation({
        mutationFn: createEntriesJson,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['entries'] });
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

    const handleDownloadTemplate = () => { }

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error loading scores.</div>;
    }

    return (
        <>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}
            >
                <Box>
                    <Typography variant="h4" noWrap>Date : {date}</Typography>
                    <Typography variant="h4" noWrap>Boss : {bossName}</Typography>
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 1
                    }}
                >
                    <EntryFormDialog />
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
                    >
                        JSON Template
                    </Button>
                </Box>
            </Box>
            <div>
                <h3>Score List:</h3>
            </div>
            <Grid container spacing={2}>
                <Grid
                    size={{
                        xs: 12,
                        md: 8,
                    }}
                >
                    <List>
                        {scoreList?.map((entry) => (
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

export default EntryView