import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";

import { getHitsSummary } from "../../services/guildBossEntryService";
import { getPlayers } from "../../services/playerService";

import type { IPlayer } from "../../types/player";
import type { IHitsSummary } from "../../types/guildBoss";

function HitsSummaryDialog({ seasonId }: { seasonId: number }) {
    const [open, setOpen] = useState(false);

    const { data: playerData } = useQuery<IPlayer[]>({
        queryKey: ['players'],
        queryFn: getPlayers,
    });

    return (
        <Box sx={{ my: 2 }}>
            <Button variant="outlined" onClick={() => setOpen(true)}>
                ดูสรุปรอบตีรวม
            </Button>
            <Content
                seasonId={seasonId}
                open={open}
                setOpen={setOpen}
                playerData={playerData}
            />
        </Box>
    )
}

export default HitsSummaryDialog

const Content = ({
    seasonId,
    open,
    setOpen,
    playerData
}: {
    seasonId: number;
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    playerData?: IPlayer[]
}) => {

    const { data, isLoading, error } = useQuery<IHitsSummary[]>({
        queryKey: ['hitsSummary', seasonId],
        queryFn: () => getHitsSummary(seasonId),
        enabled: open && !!playerData,
    });

    const getPlayerName = (id: number) => {
        return playerData?.find(p => p.id === id)?.name || 'Unknown Player';
    }

    return (
        <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
            <DialogTitle>สรุปรอบตีรวม</DialogTitle>
            <DialogContent dividers>

                {isLoading && <Typography>กำลังโหลด...</Typography>}
                {error && <Typography color="error">เกิดข้อผิดพลาดในการโหลดข้อมูล</Typography>}

                <List>
                    {data?.map((d, index) => (
                        <ListItem key={d.playerId}>
                            <ListItemText primary={`${index+1}. ${getPlayerName(d.playerId)}`} />
                            <Typography>รอบตีรวม: {d._sum.hits}</Typography>
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setOpen(false)}>ปิด</Button>
            </DialogActions>
        </Dialog>
    );
}