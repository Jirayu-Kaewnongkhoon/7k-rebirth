import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { Delete, Save } from "@mui/icons-material";
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from "@mui/material/Divider";
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import type { IGuildBoss, IGuildBossEntry } from "../../types/guildBoss";
import type { IPlayer } from "../../types/player";

import { createEntries } from "../../services/guildBossEntryService";
import { getPlayers } from "../../services/playerService";

interface EntryInput {
    playerId: number | null
    score: number
    hits: number
}

export default function GuildBossEntryFormDialog({
    seasonId,
    boss,
    scoreList
}: {
    seasonId: number
    boss: IGuildBoss
    scoreList: IGuildBossEntry[]
}) {

    const queryClient = useQueryClient();

    const { data: playerOptions } = useQuery<IPlayer[]>({
        queryKey: ['players'],
        queryFn: getPlayers
    });

    const [entries, setEntries] = useState<EntryInput[]>([
        { playerId: null, score: 0, hits: 0 }
    ]);

    const selectedPlayerIds = [...new Set(
        [
            ...entries
                .map(e => e.playerId)
                .filter((id): id is number => id !== null),
            ...scoreList?.map(score => score.player.id) || []
        ]
    )];

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setEntries([{ playerId: null, score: 0, hits: 0 }]);
    };

    const handleChange = (
        index: number,
        field: keyof EntryInput,
        value: string | number | null
    ) => {
        const updated = [...entries]
        updated[index] = {
            ...updated[index],
            [field]: value
        }
        setEntries(updated);
    }

    const handleAddRow = () => {
        setEntries([...entries, { playerId: null, score: 0, hits: 0 }])
    }

    const handleRemoveRow = (index: number) => {
        const updated = entries.filter((_, i) => i !== index)
        setEntries(updated)
    }

    const handleSubmit = () => {
        const data = {
            seasonId,
            bossId: boss.id,
            entries: entries
                .filter(e => e.playerId !== null) // กรองเฉพาะ entry ที่มี playerId ไม่เป็น null
                .map(e => ({
                    playerId: e.playerId as number,
                    score: e.score,
                    hits: e.hits,
                }))
        }
        mutation.mutate(data);
    }

    const mutation = useMutation({
        mutationFn: createEntries,
        onSuccess: () => {
            handleClose();
            queryClient.invalidateQueries({ queryKey: ['guild-boss-entries', { seasonId, bossId: boss.id }] });
        }
    })

    return (
        <>
            <Button
                variant="contained"
                size="small"
                color="primary"
                onClick={handleClickOpen}
            >
                เพิ่มอันดับคะแนน
            </Button>
            <Dialog
                fullWidth
                maxWidth="md"
                open={open}
                onClose={handleClose}
            >
                <DialogTitle>อันดับคะแนน : บอส{boss.name}</DialogTitle>
                <DialogContent>
                    <Divider sx={{ marginBlock: 1 }} />
                    <Stack spacing={2}>
                        {entries.map((entry, index) => (
                            <Stack direction="row" spacing={2} key={index}>
                                <Autocomplete
                                    options={playerOptions?.filter(option => {
                                        const isSelected = selectedPlayerIds.includes(option.id);
                                        return !isSelected;
                                    }) || []}
                                    getOptionLabel={(option) => option.name}
                                    value={playerOptions?.find(p => p.id === entry.playerId) || null}
                                    onChange={(_, newValue) => {
                                        handleChange(index, "playerId", newValue?.id ?? null)
                                    }}
                                    renderInput={(params) => (
                                        <TextField {...params} label="ชื่อผู้เล่น" />
                                    )}
                                    sx={{ width: 250 }}
                                />

                                <TextField
                                    label="คะแนน"
                                    value={entry.score}
                                    onChange={(e) =>
                                        handleChange(index, "score", Number(e.target.value))
                                    }
                                />

                                <TextField
                                    label="จำนวนรอบ"
                                    value={entry.hits}
                                    onChange={(e) =>
                                        handleChange(index, "hits", Number(e.target.value))
                                    }
                                />

                                <IconButton
                                    color="error"
                                    onClick={() => handleRemoveRow(index)}
                                >
                                    <Delete />
                                </IconButton>
                            </Stack>
                        ))}

                        <Button variant="outlined" onClick={handleAddRow}>
                            เพิ่มช่องกรอก
                        </Button>

                        <Button
                            variant="contained"
                            disabled={entries.some(e => e.playerId == null) || entries.length == 0}
                            onClick={handleSubmit}
                            loading={mutation.isPending}
                            loadingPosition="start"
                            startIcon={<Save />}
                        >
                            Submit
                        </Button>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}