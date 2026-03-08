import { createBrowserRouter, Navigate, Outlet } from "react-router";

import MainLayout from "../layouts/MainLayout";
import EntryView from "../pages/EntryView/EntyView";
import LeaderBoardView from "../pages/LeaderBoardView/LeaderBoardView";
import Member from "../pages/Member/Member";
import Player from "../pages/Player/Player";

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
                        element: <LeaderBoardView />
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
                        element: <Member />
                    },
                    {
                        path: ":id",
                        element: <Player />
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