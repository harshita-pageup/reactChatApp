import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ChevronsUpDown, Loader2, LogOut, MenuSquareIcon, Palette, User2 } from "lucide-react"
import { ChatUser, User } from "@/types/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import UserAvatar from "./user-avatar";
import NewMessageDialog from "./new-message-dialog";
import { removeToken } from "@/utils/auth";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useUser } from "@/context/UserContext";

type ChatSidebarProps = {
  chatUsers: ChatUser[],
  selectedUser: ChatUser | null,
  setSelectedUser: (user: ChatUser) => void,
  isLoading: boolean
}
export function ChatSidebar({ chatUsers, selectedUser, setSelectedUser, isLoading }: ChatSidebarProps) {
  const { state } = useSidebar();

  return (
    <Sidebar>
      <SidebarHeader className='flex gap-2 py-3'>
        <div className="flex justify-between items-center w-full">
          <h1 className={`text-xl font-bold transition-all ${state === 'collapsed' ? 'hidden' : ''}`}>Chats</h1>
          <div className="flex gap-1">
            <NewMessageDialog />
            <Button variant='outline' size='icon'>
              <MenuSquareIcon />
            </Button>
          </div>
        </div>
        <Input type="text" placeholder="Search" className="rounded-full" />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {isLoading && (
              <SidebarMenuItem className="flex justify-center">
                <Loader2 className="w-10 h-10 animate-spin" />
              </SidebarMenuItem>
            )}
            {!isLoading && chatUsers.map(item => (
              <SidebarMenuItem key={item.id} onClick={() => setSelectedUser(item)}>
                <SidebarMenuButton asChild>
                  <UserCard chatUser={item} isSelected={item.id === selectedUser?.id} />
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <ProfileDropDown />
      </SidebarFooter>
    </Sidebar>
  )
}

function ProfileDropDown() {

  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setLoading(true);
    removeToken();
    console.log("logout")
    setTimeout(() => {
      setLoading(false);
      navigate("/");
    }, 1000);
  };

  if (!user) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton size="lg" className="text-sidebar-accent-foreground data-[state=open]:bg-sidebar-accent group">
          <UserInfo user={user} />
          <ChevronsUpDown className="ml-auto size-4" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent side='right' sideOffset={15} align='end' alignOffset={-10} className='w-[14rem] mb-2'>
        <DropdownMenuLabel className='flex justify-between items-center p-1.5'>
          <div className='flex gap-1.5'>
            <img src={`https://ui-avatars.com/api/?background=222&color=fff&name=${user.name}`} alt={user.name} className='rounded-lg w-8 h-8' />
            <div className="grid flex-1 text-left text-sm leading-tight">
              <p className='truncate font-semibold'>{user.name}</p>
              <p className='truncate text-xs'>{user.email}</p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <User2 /> Profile
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Palette /> Theme
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          {loading ? (<Loader2 className="animate-spin" />) : (<LogOut />)}
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

type UserInfoProps = { user: User }
function UserInfo({ user }: UserInfoProps) {
  return (
    <>
      <UserAvatar userProfileOrName={user.profile || user.name} />
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-medium">{user.name}</span>
        <span className="text-muted-foreground truncate text-xs">{user.email}</span>
      </div>
    </>
  );
}

type UserCardProps = { chatUser: ChatUser, isSelected: boolean }
function UserCard({ chatUser, isSelected }: UserCardProps) {
  return (
    <button className={`flex items-start gap-2.5 rounded-lg border-2 p-3 text-left text-sm transition-all hover:bg-accent w-full ${isSelected ? 'bg-muted' : ''}`}>
      <UserAvatar userProfileOrName={chatUser.profile || chatUser.name} />

      <div className="flex flex-col gap-2 w-full">
        <div className="flex w-full flex-col gap-1">
          <div className="flex items-center">
            <div className="flex items-center gap-2">
              <div className="font-semibold">{chatUser.name}</div>
            </div>
            <div className="ml-auto text-xs text-foreground">{new Date(chatUser.lastMsgDate).toLocaleDateString()}</div>
          </div>
        </div>
        <div className="line-clamp-2 text-xs text-muted-foreground">{chatUser.lastMsg}</div>
      </div>
    </button>
  );
}