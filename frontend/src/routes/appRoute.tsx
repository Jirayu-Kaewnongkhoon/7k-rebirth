import { createBrowserRouter, Navigate, Outlet } from "react-router";
import { Helmet } from "react-helmet-async";

import MainLayout from "../layouts/MainLayout";
import EntryView from "../pages/EntryView/EntyView";
import LeaderBoardView from "../pages/LeaderBoardView/LeaderBoardView";
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
                                <LeaderBoardView />
                            </>
                        )
                    },
                    {
                        path: ":id",
                        element: <EntryView />
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