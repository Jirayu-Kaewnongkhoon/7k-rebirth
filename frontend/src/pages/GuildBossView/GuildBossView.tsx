import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";

import { Divider, Grid, List, ListItemButton, ListItemText, Pagination, Typography } from "@mui/material";

import GuildBossSeasonFormDialog from "../../components/GuildBossSeasonFormDialog/GuildBossSeasonFormDialog";

import { getSeasons } from "../../services/guildBossService";

import type { IGuildBossSeason } from "../../types/guildBoss";

import { dateFormat } from "../../utils/date";

interface IGuildBossSeasonResponse {
    seasons: IGuildBossSeason[]
    rowCount: number
}

const ROW_PER_PAGE = 5;
const PADDING_BLOCK = 8 * 2;
const LIST_ITEM_HEIGHT = 48;

function GuildBossView() {
    const [page, setPage] = useState(1);

    const {
        data: { seasons, rowCount } = { seasons: [], rowCount: 0 },
        isLoading,
        isError
    } = useQuery<IGuildBossSeasonResponse>({
        queryKey: ['guild-boss-seasons', { page }],
        queryFn: () => getSeasons(page, ROW_PER_PAGE),
        placeholderData: (prev) => prev
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
                count={Math.ceil(rowCount / ROW_PER_PAGE)}
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

    const handleClick = (id: number) => {
        navigate(`/boss/${id}`);
    }

    const textDisplay = (text: string) => {
        return <Typography variant="body1" color="text.secondary" textAlign="center" padding={2}>
            {text}
        </Typography>
    }

    return (
        <Grid container>
            <Grid size={{ xs: 12, md: 8 }}>
                <List sx={{ minHeight: ROW_PER_PAGE * LIST_ITEM_HEIGHT + PADDING_BLOCK }}>
                    {isLoading ? (
                        textDisplay('กำลังโหลด...')
                    ) : isError ? (
                        textDisplay('เกิดข้อผิดพลาดในการโหลดซีซั่น')
                    ) : seasons.length === 0 ? (
                        textDisplay('ยังไม่มีข้อมูลซีซั่น')
                    ) : (
                        seasons?.map((season) => (
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
                        ))
                    )}
                </List>

                <Divider sx={{ mb: 2 }} />

            </Grid>
        </Grid>
    )
}