import { useState } from 'react';
import { NavLink, Outlet } from 'react-router';

import { Castle, CrueltyFree, Menu, People } from '@mui/icons-material';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { StyledEngineProvider } from '@mui/material/styles';

const drawerWidth = 240;

const sidebarList = [
    {
        to: "/leaderboard",
        icon: <Castle />,
        label: "สงครามชิงปราสาท"
    },
    {
        to: "/boss",
        icon: <CrueltyFree />,
        label: "บอสจุติ"
    },
    {
        to: "/member",
        icon: <People />,
        label: "สมาชิกกิลด์"
    },
]

interface Props {
    /**
     * Injected by the documentation to work in an iframe.
     * Remove this when copying and pasting into your project.
     */
    window?: () => Window;
}
// TODO: แก้ warning focus
function Sidebar2(props: Props) {
    const { window } = props;
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    const handleDrawerClose = () => {
        setIsClosing(true);
        setMobileOpen(false);
    };

    const handleDrawerTransitionEnd = () => {
        setIsClosing(false);
    };

    const handleDrawerToggle = () => {
        if (!isClosing) {
            setMobileOpen(!mobileOpen);
        }
    };

    const drawer = (
        <div>
            <Toolbar />
            <Divider />
            <List>
                {sidebarList.map(sidebar => (
                    <SidebarItem
                        key={sidebar.label}
                        to={sidebar.to}
                        icon={sidebar.icon}
                        label={sidebar.label}
                        onClick={handleDrawerToggle}
                    />
                ))}
            </List>
        </div>
    );

    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <AppBar
                position="fixed"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <Menu />
                    </IconButton>
                    <Typography variant="h6" noWrap component="div">
                        7k: Rebirth
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
            >
                <Drawer
                    container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onTransitionEnd={handleDrawerTransitionEnd}
                    onClose={handleDrawerClose}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    slotProps={{
                        root: {
                            keepMounted: true, // Better open performance on mobile.
                            disableEnforceFocus: true,
                            disableAutoFocus: true,
                        },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
            >
                <Toolbar />
                <Outlet />
            </Box>
        </Box>
    )
}

export default withExtraInfo(Sidebar2)

function withExtraInfo(
    // Then we need to type the incoming component.
    // This creates a union type of whatever the component
    // already accepts AND our extraInfo prop
    WrappedComponent: React.ComponentType<Props>
) {

    const ComponentWithExtraInfo = (props: Props) => {
        // At this point, the props being passed in are the original props the component expects.
        return (
            <StyledEngineProvider injectFirst>
                <WrappedComponent {...props} />
            </StyledEngineProvider>
        )
    };
    return ComponentWithExtraInfo;
}

function SidebarItem({
    to,
    icon,
    label,
    onClick
}: {
    to: string
    icon: React.ReactNode
    label: string
    onClick: Function
}) {
    return (
        <ListItemButton
            component={NavLink}
            to={to}
            onClick={() => onClick()}
            sx={{
                "&.active": {
                    backgroundColor: "#e3f2fd"
                }
            }}
        >
            <ListItemIcon>
                {icon}
            </ListItemIcon>
            <ListItemText primary={label} />
        </ListItemButton>
    )
}