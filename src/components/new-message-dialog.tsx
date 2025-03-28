import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "./ui/input"
import { useEffect, useState } from "react"
import { User } from "@/types/auth"
import { CheckIcon, Edit, Loader2 } from "lucide-react"
import axiosInstance from "@/api/axiosInstance"
import { useChatUsers } from "@/context/UserListContext"

const fetchUsers = async () => {
  try {
    const response = await axiosInstance.post(`/api/allUsers`, { page: 1, perPage: 15 });
    return response.data.data.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

const NewMessageDialog = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<number | null>();
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { setChatUsers } = useChatUsers();

  useEffect(() => {
    const loadUsers = async () => {
      const usersData = await fetchUsers();
      setUsers(usersData);
      setFilteredUsers(usersData);
    };
    loadUsers();
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    const filtered = users.filter(user =>
      user.name.toLowerCase().includes(value.toLowerCase()) ||
      user.email.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const handleNewMessage = async () => {
    if (!selectedUser) return;
  
    setLoading(true);
  
    try {
      await axiosInstance.post(`/api/sendMessage`, {
        message: null,
        receiverId: selectedUser,
        replyMsgId: null,
      });
  
      // Add the selected user to chatUsers state
       let filteredSelectedUser = filteredUsers.find(user=> user.id==selectedUser)
      console.log(filteredSelectedUser)
      setChatUsers((prev) => {
      const updatedChatUsers = [...prev, { id: selectedUser, name: filteredSelectedUser?.name, email: filteredSelectedUser?.email, profile: filteredSelectedUser?.profile, isOnline: true }];
        return updatedChatUsers;
      });
  
      setDialogOpen(false);
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
          <div className="space-y-2 max-h-60 overflow-y-auto flex flex-col">
            {filteredUsers.map((user) => (
              <label key={user.id} onClick={() => setSelectedUser(user.id)}>
                <input type="radio" name="users" className="hidden peer" checked={selectedUser === user.id} />
                <div
                  className="flex items-center justify-between p-2 hover:bg-zinc-800 rounded-md cursor-pointer peer-checked:bg-zinc-800"
                >
                  <div className="flex items-center space-x-3">
                    <img src={user.profile != null ? "http://127.0.0.1:8000/uploads/" + user.profile : `https://ui-avatars.com/api/?background=222&color=fff&name=${user.name}`} alt={user.name} className='rounded-lg w-8 h-8' />
                    <div>
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  {selectedUser === user.id && <CheckIcon className="w-4 h-4 " />}
                </div>
              </label>
            ))}
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