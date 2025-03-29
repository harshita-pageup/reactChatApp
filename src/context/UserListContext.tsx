import { ChatUser } from "@/types/auth";
import { createContext, useContext, useState, ReactNode } from "react";

interface UserListContextType {
    chatUsers: ChatUser[];
    setChatUsers: React.Dispatch<React.SetStateAction<ChatUser[]>>;
}

const UserListContext = createContext<UserListContextType | undefined>(undefined);

export const useChatUsers = () => {
    const context = useContext(UserListContext);
    if (!context) {
        throw new Error("An unknown error occurred");
    }
    return context;
};

export const UserListProvider = ({ children }: { children: ReactNode }) => {
    const [chatUsers, setChatUsers] = useState<ChatUser[]>([]);

    return (
        <UserListContext.Provider value={{ chatUsers, setChatUsers }}>
            {children}
        </UserListContext.Provider>
    );
};