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
                create season
            </Button>
            <Dialog
                fullWidth
                maxWidth="md"
                open={open}
                onClose={handleClose}
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
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            mutation.mutate(startDate);
                        }}
                        disabled={startDate == null}
                        loading={mutation.isPending}
                        loadingPosition="start"
                        startIcon={<Save />}
                    >
                        Submit
                    </Button>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default GuildBossSeasonFormDialog