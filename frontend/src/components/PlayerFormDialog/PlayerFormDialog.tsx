import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { Save } from "@mui/icons-material";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';

import { createPlayer } from "../../services/playerService";

export default function PlayerFormDialog() {
    const queryClient = useQueryClient();

    const [name, setName] = useState('');
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setName('');
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    }

    const handleSubmit = () => {
        mutation.mutate(name);
    }

    const mutation = useMutation({
        mutationFn: createPlayer,
        onSuccess: () => {
            handleClose();
            queryClient.invalidateQueries({ queryKey: ['players'] });
        }
    })

    return (
        <>
            <Button
                variant="contained"
                color="primary"
                onClick={handleClickOpen}
            >
                เพิ่มสมาชิก
            </Button>
            <Dialog
                fullWidth
                maxWidth="md"
                open={open}
                onClose={handleClose}
            >
                <DialogTitle>ชื่อผู้เล่น</DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <TextField
                            placeholder="ชื่อ"
                            value={name}
                            onChange={handleChange}
                        />

                        <Button
                            variant="contained"
                            disabled={name == ""}
                            onClick={handleSubmit}
                            loading={mutation.isPending}
                            loadingPosition="start"
                            startIcon={<Save />}
                        >
                            Submit
                        </Button>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog >
        </>
    )
}