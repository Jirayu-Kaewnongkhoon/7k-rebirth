import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router'

import { getPlayer } from '../../services/playerService';
import type { Player } from '../EntryView/EntyView';
import { getPlayerBossStat } from '../../services/playerBossStatService';
import { Divider } from '@mui/material';

function Player() {
    const { id: playerId } = useParams();
    const { data: player, isLoading, isError } = useQuery<Player>({
        queryKey: ['player', playerId],
        queryFn: () => getPlayer(Number(playerId)!)
    });

    // const { data: stat } = useQuery({
    //     queryKey: ['playerStat', playerId],
    //     queryFn: () => getPlayerBossStat(Number(playerId)!)
    // });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error loading player.</div>;
    }

    if (!player || !player?.isActive) {
        return <>player not found</>
    }

    return (
        <>
            <h3>Player ID: {playerId}</h3>
            <p>{player?.name}</p>
            <Divider />
            <h3>Stats</h3>
            {player.stats.map((stat) => (
                <div
                    key={stat.id}
                    style={{
                        border: '1px solid black',
                        margin: '10px',
                        padding: '10px',
                    }}
                >
                    <p>Boss: {stat.boss.name}</p>
                    <p>Last Score: {stat.lastScore}</p>
                    <p>Max Score: {stat.maxScore}</p>
                </div>
            ))}
        </>
    )
}

export default Player