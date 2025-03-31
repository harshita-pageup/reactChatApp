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
import { ChevronsUpDown, Loader2, LogOut, MenuSquareIcon, User2 } from "lucide-react"
import { ChatUser, User } from "@/types/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import NewMessageDialog from "./new-message-dialog";
import { removeToken } from "@/utils/auth";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useUser } from "@/context/UserContext";
import { BASE_URL } from "@/api/enviornment";

type ChatSidebarProps = {
  chatUsers: ChatUser[],
  selectedUser: ChatUser | null,
  setSelectedUser: (user: ChatUser | null) => void,
  isLoading: boolean,
  loadMoreRef: React.RefObject<HTMLDivElement>,
  hasMore: boolean
}

export function ChatSidebar({ chatUsers, selectedUser, setSelectedUser, isLoading, loadMoreRef, hasMore }: ChatSidebarProps) {
  const { state } = useSidebar();
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredUsers = chatUsers.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        <Input
          type="text"
          placeholder="Search"
          className="rounded-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {isLoading && (
              <SidebarMenuItem className="flex flex-col items-center justify-center gap-1">
                <Loader2 className="w-10 h-10 animate-spin" />
                <p className='text-primary text-sm animate-pulse'>Loading the users...</p>
              </SidebarMenuItem>
            )}
            {!isLoading && filteredUsers.length === 0 && (
              <SidebarMenuItem className="flex justify-center">
                <p className="text-muted">No users found</p>
              </SidebarMenuItem>
            )}
            {!isLoading && filteredUsers.sort((a, b) => {
              const dateA = new Date(a.lastMsgDate);
              const dateB = new Date(b.lastMsgDate);
              return dateB.getTime() - dateA.getTime();
            }).map((item) => (
              <SidebarMenuItem key={item.id} onClick={() => setSelectedUser(item)}>
                <SidebarMenuButton asChild>
                  <UserCard chatUser={item} isSelected={item.id === selectedUser?.id} />
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
            {isLoading && <Loader2 className="h-6 w-6 animate-spin mx-auto" />}
            {hasMore && !isLoading && <div ref={loadMoreRef} className="h-1"></div>}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <ProfileDropDown />
      </SidebarFooter>
    </Sidebar>
  );
}

function ProfileDropDown() {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    setLoading(true);
    removeToken();
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
            <img src={user.profile != null ? `${BASE_URL}/uploads/${user.profile}` : `https://ui-avatars.com/api/?background=222&color=fff&name=${user.name}`} alt={user.name} className='rounded-lg w-8 h-8' />
            <div className="grid flex-1 text-left text-sm leading-tight">
              <p className='truncate font-semibold'>{user.name}</p>
              <p className='truncate text-xs'>{user.email}</p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => navigate('/profile')}>
          <User2 /> Profile
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
      <img src={user.profile != null ? `${BASE_URL}/uploads/${user.profile}` : `https://ui-avatars.com/api/?background=222&color=fff&name=${user.name}`} alt={user.name} className='rounded-lg w-8 h-8' />
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
    <button className={`flex items-center gap-2.5 rounded-lg border-2 p-3 text-left text-sm transition-all hover:bg-accent w-full ${isSelected ? 'bg-muted' : ''}`}>
      <img src={chatUser.profile != null ? `${BASE_URL}/uploads/${chatUser.profile}` : `https://ui-avatars.com/api/?background=222&color=fff&name=${chatUser.name}`} className='w-10 h-10 rounded-full object-cover' />
      <div className="flex flex-col w-full">
        <div className="flex w-full flex-col gap-1">
          <div className="flex items-center">
            <div className="flex items-center gap-2">
              <div className="font-semibold">{chatUser.name}</div>
            </div>
            <div className="ml-auto text-xs text-foreground">{new Date(chatUser.lastMsgDate).toLocaleDateString()}</div>
          </div>
        </div>
        <div className="line-clamp-1 text-xs text-muted-foreground">{chatUser.lastMsg}</div>
      </div>
    </button>
  );
}
