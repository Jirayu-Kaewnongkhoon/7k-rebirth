import { useState, type ChangeEvent } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';

import { createLeaderboard } from "../../services/leaderboardService";
import { getBoss } from "../../services/bossService";

export interface LeaderBoardFormData {
    date: Date;
    bossId: number;
}

export interface Boss {
    name: string;
    id: number;
    weekday: number;
}

export default function LeaderboardFormDialog() {
    const [open, setOpen] = useState(false);

    const [data, setData] = useState<LeaderBoardFormData>({
        date: "" as unknown as Date,
        bossId: "" as unknown as number,
    });

    const { data: bossList } = useQuery<Boss[]>({
        queryKey: ['boss'],
        queryFn: getBoss
    });

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: createLeaderboard,
        onSuccess: () => {
            // Invalidate and refetch
            handleClose();
            queryClient.invalidateQueries({ queryKey: ['leaderboards'] })
        },
    })

    const handleClickOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;

        setData({
            ...data,
            [name]: value,
        } as LeaderBoardFormData);
    }

    return (
        <>
            <Button variant="contained" onClick={handleClickOpen}>
                เพิ่มหัวตาราง
            </Button>
            <Dialog
                fullWidth
                maxWidth="md"
                open={open}
                onClose={handleClose}
            >
                <DialogTitle>หัวตาราง</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        variant="outlined"
                        type="date"
                        name="date"
                        value={data?.date}
                        onChange={handleChange}
                    />
                    <TextField
                        select
                        fullWidth
                        variant="outlined"
                        label="Boss"
                        name="bossId"
                        value={data?.bossId}
                        onChange={handleChange}
                    >
                        <MenuItem value="">Select Boss</MenuItem>
                        {bossList?.map((option) => (
                            <MenuItem key={option.id} value={option.id}>
                                {option.name}
                            </MenuItem>
                        ))}
                    </TextField>
                    <Button variant="contained" color="primary" onClick={() => mutation.mutate(data)}>
                        Submit
                    </Button>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}