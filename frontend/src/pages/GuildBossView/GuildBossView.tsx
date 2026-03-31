import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";

import { Grid, List, ListItemButton, ListItemText, Pagination } from "@mui/material";

import GuildBossSeasonFormDialog from "../../components/GuildBossSeasonFormDialog/GuildBossSeasonFormDialog";

import { getSeasons } from "../../services/guildBossService";

import type { IGuildBossSeason } from "../../types/guildBoss";

interface IGuildBossSeasonResponse {
    seasons: IGuildBossSeason[]
    rowCount: number
}

const ROW_PER_PAGE = 2;

function GuildBossView() {
    const [page, setPage] = useState(1);

    const {
        data: { seasons, rowCount } = { seasons: [], rowCount: 0 },
        isLoading,
        isError
    } = useQuery<IGuildBossSeasonResponse>({
        queryKey: ['guild-boss-seasons', { page }],
        queryFn: () => getSeasons(page, ROW_PER_PAGE),
    });

    const handlePageChange = (_e: React.ChangeEvent<unknown, Element>, page: number) => {
        setPage(page);
    }

    return (
        <>
            <GuildBossSeasonFormDialog page={page} />

            <GuildBossSeasonList
                seasons={seasons}
                isLoading={isLoading}
                isError={isError}
            />

            <Pagination
                count={rowCount / ROW_PER_PAGE}
                showFirstButton
                showLastButton
                page={page}
                onChange={handlePageChange}
            />
        </>
    )
}

export default GuildBossView

function GuildBossSeasonList({
    seasons = [],
    isLoading,
    isError
}: {
    seasons?: IGuildBossSeason[]
    isLoading: boolean
    isError: boolean
}) {

    const navigate = useNavigate();

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

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error loading seasons.</div>;
    }

    return (
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
    )
}