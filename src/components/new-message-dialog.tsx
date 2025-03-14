import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "./ui/input"
import { useState } from "react"
import { User } from "@/types/auth"
import UserAvatar from "./user-avatar"
import { Edit } from "lucide-react"


const NewMessageDialog = () => {
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: 'Abhinav Namdeo',
      email: 'abhaynam22@gmail.com',
      profile: 'https://ui-avatars.com/api/Abhinav Namdeo'
    },
    {
      id: 2,
      name: 'Harshita Shrivastava',
      email: 'harshita@gmail.com',
      profile: 'https://ui-avatars.com/api/Harshita Shrivastava'
    },
    {
      id: 3,
      name: 'Amit Yadav',
      email: 'amit@gmail.com',
      profile: 'https://ui-avatars.com/api/Amit Yadav'
    },
    {
      id: 4,
      name: 'Priya Sharma',
      email: 'priya@gmail.com',
      profile: 'https://ui-avatars.com/api/Priya Sharma'
    },
    {
      id: 5,
      name: 'Rohan Verma',
      email: 'rohan@gmail.com',
      profile: 'https://ui-avatars.com/api/Rohan Verma'
    },
    {
      id: 6,
      name: 'Sneha Patel',
      email: 'sneha@gmail.com',
      profile: 'https://ui-avatars.com/api/Sneha Patel'
    },
    {
      id: 7,
      name: 'Vikram Singh',
      email: 'vikram@gmail.com',
      profile: 'https://ui-avatars.com/api/Vikram Singh'
    },
    {
      id: 8,
      name: 'Ananya Gupta',
      email: 'ananya@gmail.com',
      profile: 'https://ui-avatars.com/api/Ananya Gupta'
    },
    {
      id: 9,
      name: 'Kunal Kapoor',
      email: 'kunal@gmail.com',
      profile: 'https://ui-avatars.com/api/Kunal Kapoor'
    },
  ]);

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
            />
          </div>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {users.map((user, index) => (
              <div
                key={index}
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