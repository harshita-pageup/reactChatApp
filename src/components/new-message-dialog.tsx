import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "./ui/input"
import { useEffect, useState, useRef } from "react"
import { User } from "@/types/auth"
import { CheckIcon, Edit, Loader2 } from "lucide-react"
import axiosInstance from "@/api/axiosInstance"
import { useChatUsers } from "@/context/UserListContext"
import { BASE_URL } from "@/api/enviornment"

const fetchUsers = async (page: number, search: string = '') => {
  try {
    const response = await axiosInstance.post('/api/allUsers', { 
      page, 
      perPage: 15,
      search
    });
    return {
      users: response.data.data.data,
      pagination: response.data.data.pagination
    };
  } catch (error) {
    console.error(error);
    return { users: [], pagination: null };
  }
};

const NewMessageDialog = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const { setChatUsers } = useChatUsers();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const loadUsers = async (pageNum: number, search: string = '', append = false) => {
    setIsFetching(true);
    const { users: newUsers, pagination } = await fetchUsers(pageNum, search);
    
    setUsers(prev => append ? [...prev, ...newUsers] : newUsers);
    setFilteredUsers(prev => append ? [...prev, ...newUsers] : newUsers);
    setHasMore(pagination?.hasMorePages || false);
    setIsFetching(false);
  };

  useEffect(() => {
    if (dialogOpen) {
      setPage(1);
      setUsers([]);
      setFilteredUsers([]);
      loadUsers(1, searchTerm);
    }
  }, [dialogOpen]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (dialogOpen) {
        setPage(1);
        setUsers([]);
        setFilteredUsers([]);
        loadUsers(1, searchTerm);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, dialogOpen]);

  const handleScroll = () => {
    if (!scrollContainerRef.current || !hasMore || isFetching) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 20) {
      setPage(prev => prev + 1);
    }
  };

  useEffect(() => {
    if (page > 1 && hasMore && !isFetching) {
      loadUsers(page, searchTerm, true);
    }
  }, [page]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [hasMore, isFetching]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleNewMessage = async () => {
    if (!selectedUser) return;

    setLoading(true);
    try {
      await axiosInstance.post('/api/sendMessage', {
        message: null,
        receiverId: selectedUser,
        replyMsgId: null,
      });
      
      const updatedFilteredUsers = filteredUsers.filter(user => user.id !== selectedUser);
      const updatedUsers = users.filter(user => user.id !== selectedUser);

      setFilteredUsers(updatedFilteredUsers);
      setUsers(updatedUsers);

      const filteredSelectedUser = filteredUsers.find(user => user.id === selectedUser);
      if (filteredSelectedUser) {
        setChatUsers((prev) => [
          ...prev,
          {
            id: selectedUser,
            name: filteredSelectedUser.name,
            email: filteredSelectedUser.email,
            profile: filteredSelectedUser.profile,
            isOnline: true,
            lastMsg: '',
            lastMsgDate: new Date().toLocaleString('sv'),
          }
        ]);
      }

      setDialogOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size='icon'>
          <Edit />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New message</DialogTitle>
          <p className="text-sm text-gray-400">
            Invite a user to this thread. This will create a new group message.
          </p>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search user..."
              className="w-full"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <div 
            ref={scrollContainerRef}
            className="space-y-2 max-h-60 overflow-y-auto flex flex-col"
          >
            {filteredUsers.map((user) => (
              <label key={user.id} onClick={() => setSelectedUser(user.id)}>
                <input type="radio" name="users" className="hidden peer" checked={selectedUser === user.id} />
                <div
                  className="flex items-center justify-between p-2 hover:bg-zinc-800 rounded-md cursor-pointer peer-checked:bg-zinc-800"
                >
                  <div className="flex items-center space-x-3">
                    <img 
                      src={user.profile != null 
                        ? `${BASE_URL}/uploads/${user.profile}` 
                        : `https://ui-avatars.com/api/?background=222&color=fff&name=${user.name}`} 
                      alt={user.name} 
                      className='rounded-lg w-8 h-8' 
                    />
                    <div>
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  {selectedUser === user.id && <CheckIcon className="w-4 h-4" />}
                </div>
              </label>
            ))}
            {hasMore && isFetching && (
              <div className="flex justify-center py-2">
                <Loader2 className="animate-spin w-6 h-6" />
              </div>
            )}
          </div>
          <Button className="w-full" disabled={!selectedUser || loading} onClick={handleNewMessage}>
            {loading ? <Loader2 className="animate-spin" /> : "Continue"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default NewMessageDialog