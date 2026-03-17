import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";

import { Grid, List, ListItemButton, ListItemText, Pagination } from "@mui/material";

import GuildBossSeasonFormDialog from "../../components/GuildBossSeasonFormDialog/GuildBossSeasonFormDialog";

import { getSeasons } from "../../services/guildBossService";

import type { IGuildBossSeason } from "../../types/guildBoss";

function GuildBossView() {
    const navigate = useNavigate();

    const { data: seasons } = useQuery<IGuildBossSeason[]>({
        queryKey: ['guildBossSeason'],
        queryFn: getSeasons,
    });

    const dateFormat = (dateStr: string) => {
        return new Intl.DateTimeFormat("th-TH", {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }).format(new Date(dateStr))
    }

    const handleClick = (id: number) => {
        navigate(`/boss/${id}`);
    }

    return (
        <>
            <GuildBossSeasonFormDialog />

            <Grid container spacing={2}>
                <Grid
                    size={{
                        xs: 12,
                        md: 8,
                    }}
                >
                    <List>
                        {seasons?.map((season) => (
                            <ListItemButton
                                key={season.id}
                                sx={{
                                    '&:nth-of-type(even)': {
                                        backgroundColor: '#9e9e9e22'
                                    }
                                }}
                                onClick={() => handleClick(season.id)}
                            >
                                <ListItemText
                                    primary={`
                                        ซีซั่นวันที่ :
                                        ${dateFormat(season.startDate)} - 
                                        ${dateFormat(season.endDate)}
                                    `}
                                />
                            </ListItemButton>
                        ))}
                    </List>
                </Grid>
            </Grid>

            <Pagination count={10} showFirstButton showLastButton />
        </>
    )
}

export default GuildBossView