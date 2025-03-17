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
import UserAvatar from "./user-avatar"
import { Edit } from "lucide-react"

const fetchUsers = async () => {
  try {
    const response = await fetch('/api/users');
    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }
    const data = await response.json();
    return data.users;
  } catch (error) {
    console.error(error);
    return [];
  }
};

const NewMessageDialog = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

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

  return (
    <Dialog>
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
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-2 hover:bg-zinc-800 rounded-md cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <UserAvatar userProfileOrName={user.profile || user.name} />
                  <div>
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Button className="w-full">
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default NewMessageDialog