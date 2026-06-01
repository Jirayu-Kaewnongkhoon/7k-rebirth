import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { Save } from "@mui/icons-material";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";

import { createGuildBossSeason } from "../../services/guildBossService";

function GuildBossSeasonFormDialog({ page }: { page: number }) {
    const queryClient = useQueryClient();

    const [startDate, setStartDate] = useState<string>('');
    const [open, setOpen] = useState(false);

    const mutation = useMutation({
        mutationFn: createGuildBossSeason,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['guild-boss-seasons', { page }] });
            handleClose();
        }
    });

    const handleClickOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setStartDate("");
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;

        setStartDate(value);
    }

    return (
        <>
            <Button variant="contained" onClick={handleClickOpen}>
                สร้างซีซั่นใหม่
            </Button>
            <Dialog
                fullWidth
                maxWidth="md"
                open={open}
                disableEscapeKeyDown={mutation.isPending}
                onClose={() => {
                    if (mutation.isPending) return;
                    handleClose();
                }}
            >
                <DialogTitle>วันที่เริ่มซีซั่น</DialogTitle>
                <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        type="date"
                        name="date"
                        value={startDate}
                        onChange={handleChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => {
                            mutation.mutate(startDate);
                        }}
                        disabled={!startDate}
                        loading={mutation.isPending}
                        loadingPosition="start"
                        startIcon={<Save />}
                    >
                        บันทึก
                    </Button>
                    <Button disabled={mutation.isPending} onClick={handleClose}>
                        ปิด
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default GuildBossSeasonFormDialog