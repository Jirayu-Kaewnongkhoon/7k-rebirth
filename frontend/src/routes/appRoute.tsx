import { Helmet } from "react-helmet-async";
import { createBrowserRouter, Navigate, Outlet } from "react-router";

import MainLayout from "../layouts/MainLayout";
import CastleEntry from "../pages/CastleEntry/CastleEntry";
import CastleLeaderBoard from "../pages/CastleLeaderBoard/CastleLeaderBoard";
import GuildBossEntry from "../pages/GuildBossEntry/GuildBossEntry";
import GuildBossView from "../pages/GuildBossView/GuildBossView";
import Member from "../pages/Member/Member";
import PlayerView from "../pages/PlayerView/PlayerView";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <Navigate to="/leaderboard" replace />
            },
            {
                path: "leaderboard",
                element: (
                    <>
                        <CustomHelmet title="สงครามชิงปราสาท" />
                        <Outlet />
                    </>
                ),
                children: [
                    {
                        index: true,
                        element: <CastleLeaderBoard />
                    },
                    {
                        path: ":date",
                        element: <CastleEntry />
                    },
                ]
            },
            {
                path: "boss",
                element: (
                    <>
                        <CustomHelmet title="บอสจุติ" />
                        <Outlet />
                    </>
                ),
                children: [
                    {
                        index: true,
                        element: <GuildBossView />
                    },
                    {
                        path: ":id",
                        element: <GuildBossEntry />
                    },
                ]
            },
            {
                path: "member",
                element: (
                    <>
                        <CustomHelmet title="สมาชิกกิลด์" />
                        <Outlet />
                    </>
                ),
                children: [
                    {
                        index: true,
                        element: <Member />
                    },
                    {
                        path: ":id",
                        element: <PlayerView />
                    }
                ]
            },
            {
                path: "*",
                element: <div>404 Not Found</div>
            }
        ]
    }
]);

function CustomHelmet({ title }: { title: string }) {
    return (
        <Helmet>
            <title>{title}</title>
        </Helmet>
    )
}