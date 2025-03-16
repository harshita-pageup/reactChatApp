import axiosInstance from "@/api/axiosInstance";
import { User } from "@/types/auth";
import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface UserContextType {
    user: User | null;
    setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("An unknown error occurred");
    }
    return context;
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    useEffect(() => {
        axiosInstance.get('/api/authUser').then(res => {
            setUser(res.data.data.user);
        });
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};