import { useMutation, useQuery, useQueryClient, type UseMutationResult } from "@tanstack/react-query";
import { createContext, useContext } from "react";

import { fetchLogin, fetchLogout, fetchMe } from "../services/authService";

interface IUser {
    username: string
}

interface IAuthContext {
    user: IUser | null
    isLoading: boolean
    loginMutation: UseMutationResult<IUser, Error, { username: string, password: string }>
    logoutMutation: UseMutationResult<void, Error, void>
}

const AuthContext = createContext<IAuthContext | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const queryClient = useQueryClient();

    const { data: user = null, isLoading } = useQuery<IUser | null>({
        queryKey: ['me'],
        queryFn: fetchMe,
        retry: false,          // ไม่ retry ถ้า 401
        staleTime: Infinity,   // ไม่ refetch ตลอด session
    });

    const loginMutation = useMutation({
        mutationFn: ({ username, password }: { username: string; password: string }) => fetchLogin(username, password),
        onSuccess: (data) => {
            queryClient.setQueryData(['me'], data); //เซ็ต user โดยไม่ต้อง refetch /me
        }
    });

    const logoutMutation = useMutation({
        mutationFn: fetchLogout,
        onSuccess: () => {
            queryClient.setQueryData(['me'], null); //clear user
            queryClient.clear();                    //clear cache ทั้งหมด
        }
    });

    return (
        <AuthContext.Provider value={{ user, isLoading, loginMutation, logoutMutation }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}