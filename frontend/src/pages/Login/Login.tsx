import { useState } from "react";
import { Navigate } from "react-router";

import { Alert, Box, Button, TextField, Typography } from "@mui/material";

import { useAuth } from "../../contexts/AuthContext";

export default function Login() {
    const { user, isLoading, loginMutation } = useAuth();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        loginMutation.mutate({ username, password });
    };

    if (isLoading) return <div>Loading...</div>;
    if (user) return <Navigate to="/" replace />;

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                gap: 2,
            }}
        >
            <Typography variant="h5">เข้าสู่ระบบ</Typography>

            {loginMutation.isError && (
                <Alert severity="error">ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง</Alert>
            )}

            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: 300 }}
            >
                <TextField
                    label="ชื่อผู้ใช้"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoFocus
                />
                <TextField
                    label="รหัสผ่าน"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                    type="submit"
                    variant="contained"
                    loading={loginMutation.isPending}
                    loadingPosition="start"
                >
                    เข้าสู่ระบบ
                </Button>
            </Box>
        </Box>
    );
}