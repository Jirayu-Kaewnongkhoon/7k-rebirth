import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { forwardRef, useImperativeHandle, useState } from "react";

import { Delete, Save } from "@mui/icons-material";
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import type { ICastleEntry } from "../../types/castle";
import type { IPlayer } from "../../types/player";

import { getPlayers } from "../../services/playerService";
import { createEntries, getEntries } from "../../services/castleEntryService";

export interface EntryInput {
    playerId: number | null
    score: number
}

export interface CastleEntryFormDialogHandle {
    openWithEntries: (entries: EntryInput[]) => void;
}

function CastleEntryFormDialog(
    { leaderboardId }: { leaderboardId: number },
    ref: React.Ref<CastleEntryFormDialogHandle>
) {

    const queryClient = useQueryClient();

    const { data: playerOptions } = useQuery<IPlayer[]>({
        queryKey: ['players'],
        queryFn: getPlayers
    });
    const { data: scoreList } = useQuery<ICastleEntry[]>({
        queryKey: ['castle-entries', leaderboardId],
        queryFn: () => getEntries(leaderboardId),
    });

    const [entries, setEntries] = useState<EntryInput[]>([
        { playerId: null, score: 0 }
    ]);

    const selectedPlayerIds = [...new Set(
        [
            ...entries
                .map(e => e.playerId)
                .filter((id): id is number => id !== null),
            ...(scoreList?.map(score => score.player.id) ?? [])
        ]
    )];

    const [open, setOpen] = useState(false);

    useImperativeHandle(ref, () => ({
        openWithEntries: (data: EntryInput[]) => {
            setEntries(data.filter(e => e.score > 0));
            setOpen(true);
        }
    }));

    const handleClickOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setEntries([{ playerId: null, score: 0 }]);
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

    const handlePaste = (e: React.ClipboardEvent) => {
        const text = e.clipboardData.getData('text');
        const rows = text.trim().split('\n');

        const parsed = rows
            .map(row => row.split('\t'))           // แยกด้วย tab
            .filter(cols => cols.length === 2)     // ต้องมีครบ 2 ช่อง
            .map(cols => {
                const playerName = cols[0].trim();
                const player = playerOptions?.find(p => p.name === playerName);

                return {
                    playerId: player?.id ?? null,
                    score: Number(cols[1].trim().replace(/,/g, '')),
                };
            });

        if (parsed.length > 0) {
            e.preventDefault(); // ไม่ให้ paste ลง input ปกติ
            setEntries(parsed);
        }
    }

    const handleAddRow = () => {
        setEntries([...entries, { playerId: null, score: 0 }])
    }

    const handleRemoveRow = (index: number) => {
        const updated = entries.filter((_, i) => i !== index)
        setEntries(updated)
    }

    const handleSubmit = () => {
        const data = {
            leaderboardId,
            entries: entries
                .filter(e => e.playerId !== null) // กรองเฉพาะ entry ที่มี playerId ไม่เป็น null
                .map(e => ({
                    playerId: e.playerId as number,
                    score: e.score,
                }))
        }
        mutation.mutate(data);
    }

    const mutation = useMutation({
        mutationFn: createEntries,
        onSuccess: () => {
            handleClose();
            queryClient.invalidateQueries({ queryKey: ['castle-entries', leaderboardId] });
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
                <DialogTitle sx={{ paddingBottom: 1 }}>อันดับคะแนน</DialogTitle>
                <DialogContent>
                    <Stack gap={1} onPaste={handlePaste}>
                        {entries.map((entry, index) => (
                            <Stack direction="row" gap={2} marginBlock={1} key={index}>
                                <Autocomplete
                                    options={playerOptions?.filter(option => {
                                        const isSelected = selectedPlayerIds.includes(option.id);
                                        const isActive = option.isActive;
                                        return !isSelected && isActive;
                                    }) ?? []}
                                    getOptionLabel={(option) => option.name}
                                    value={playerOptions?.find(p => p.id === entry.playerId) ?? null}
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

export default forwardRef(CastleEntryFormDialog);