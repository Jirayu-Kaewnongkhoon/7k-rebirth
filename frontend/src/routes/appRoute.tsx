import { Helmet } from "react-helmet-async";
import { createBrowserRouter, Navigate, Outlet } from "react-router";

import MainLayout from "../layouts/MainLayout";
import BossGuildView from "../pages/BossGuildView/BossGuildView";
import CastleEntry from "../pages/CastleEntry/CastleEntry";
import CastleLeaderBoard from "../pages/CastleLeaderBoard/CastleLeaderBoard";
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
                element: <Outlet />,
                children: [
                    {
                        index: true,
                        element: (
                            <>
                                <CustomHelmet title="สงครามชิงปราสาท" />
                                <CastleLeaderBoard />
                            </>
                        )
                    },
                    {
                        path: ":date",
                        element: <CastleEntry />
                    },
                ]
            },
            {
                path: "boss",
                element: <Outlet />,
                children: [
                    {
                        index: true,
                        element: (
                            <>
                                <CustomHelmet title="บอสจุติ" />
                                <BossGuildView />
                            </>
                        )
                    },
                    {
                        path: ":id",
                        element: <>boss guild id</>
                    },
                ]
            },
            {
                path: "member",
                element: <Outlet />,
                children: [
                    {
                        index: true,
                        element: (
                            <>
                                <CustomHelmet title="สมาชิกกิลด์" />
                                <Member />
                            </>
                        )
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