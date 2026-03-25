import { useParams } from "react-router";

import GuildBossEntryFormDialog from "../../components/GuildBossEntryFormDialog/GuildBossEntryFormDialog";

function GuildBossEntry() {
    const { id } = useParams();

    if (!id || Number.isNaN(Number(id))) return <>season id notfound</>

    return (
        <>
            <div>GuildBossEntry: {id}</div>

            <GuildBossEntryFormDialog seasonId={parseInt(id)} />
        </>
    )
}

export default GuildBossEntry