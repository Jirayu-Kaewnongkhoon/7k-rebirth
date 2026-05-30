import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { memo, useCallback, useMemo, useState } from "react";

import { Delete, Save } from "@mui/icons-material";
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
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

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setEntries([{ playerId: null, score: 0, hits: 0 }]);
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        const text = e.clipboardData.getData('text');
        const rows = text.trim().split('\n');

        const parsed = rows
            .map(row => row.split('\t'))           // แยกด้วย tab
            .filter(cols => cols.length === 3)     // ต้องมีครบ 3 ช่อง
            .map(cols => {
                const playerName = cols[0].trim();
                const player = playerOptions?.find(p => p.name === playerName);

                return {
                    playerId: player?.id ?? null,
                    score: Number(cols[1].trim().replace(/,/g, '')),
                    hits: Number(cols[2].trim()),
                };
            });

        if (parsed.length > 0) {
            e.preventDefault(); // ไม่ให้ paste ลง input ปกติ
            setEntries(parsed);
        }
    }

    const handleAddRow = () => {
        setEntries([...entries, { playerId: null, score: 0, hits: 0 }])
    }

    const selectedPlayerIds = useMemo(() => [
        ...new Set([
            ...entries.map(e => e.playerId).filter((id): id is number => id !== null),
            ...(scoreList?.map(s => s.player.id) ?? [])
        ])
    ], [entries, scoreList]);

    const handleChange = useCallback(
        (index: number, field: keyof EntryInput, value: string | number | null) => {
            setEntries(prev => {
                const updated = [...prev];
                updated[index] = { ...updated[index], [field]: value };
                return updated;
            });
        }, []
    );

    const handleRemoveRow = useCallback((index: number) => {
        setEntries(prev => prev.filter((_, i) => i !== index));
    }, []);

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
                <DialogTitle sx={{ paddingBottom: 1 }}>อันดับคะแนน : บอส{boss.name}</DialogTitle>
                <DialogContent dividers>
                    <Stack spacing={2} paddingTop={2} onPaste={handlePaste}>
                        {entries.map((entry, index) => (
                            <Entry
                                key={index}
                                entry={entry}
                                index={index}
                                playerOptions={playerOptions ?? []}
                                selectedPlayerIds={selectedPlayerIds}
                                onChange={handleChange}
                                onRemove={handleRemoveRow}
                            />
                        ))}
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'space-between' }}>
                    <Button onClick={handleAddRow}>
                        เพิ่มช่องกรอก
                    </Button>

                    <Box>
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
                        <Button onClick={handleClose}>Close</Button>
                    </Box>
                </DialogActions>
            </Dialog>
        </>
    )
}

interface EntryProps {
    entry: EntryInput;
    index: number;
    playerOptions: IPlayer[];
    selectedPlayerIds: number[];
    onChange: (index: number, field: keyof EntryInput, value: string | number | null) => void;
    onRemove: (index: number) => void;
}

const Entry = memo(({ entry, index, playerOptions, selectedPlayerIds, onChange, onRemove }: EntryProps) => {
    return (
        <Stack direction="row" spacing={2}>
            <Autocomplete
                options={playerOptions?.filter(option => {
                    const isSelected = selectedPlayerIds.includes(option.id);
                    const isActive = option.isActive;
                    return !isSelected && isActive;
                }) ?? []}
                getOptionLabel={(option) => option.name}
                value={playerOptions?.find(p => p.id === entry.playerId) ?? null}
                onChange={(_, newValue) => {
                    onChange(index, "playerId", newValue?.id ?? null)
                }}
                renderInput={(params) => (
                    <TextField {...params} label="ชื่อผู้เล่น" />
                )}
                sx={{ width: 250 }}
            />

            <TextField
                label="คะแนน"
                type="number"
                value={entry.score}
                onChange={(e) =>
                    onChange(index, "score", Number(e.target.value))
                }
            />

            <TextField
                label="จำนวนรอบ"
                type="number"
                value={entry.hits}
                onChange={(e) =>
                    onChange(index, "hits", Number(e.target.value))
                }
            />

            <IconButton
                color="error"
                onClick={() => onRemove(index)}
            >
                <Delete />
            </IconButton>
        </Stack>
    )
});