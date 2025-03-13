import ChatBubble from '@/components/chat-bubble';
import { ChatSidebar } from '@/components/chat-sidebar'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SidebarProvider } from '@/components/ui/sidebar'
import UserAvatar from '@/components/user-avatar';
import { ChatUser, Message } from '@/types/auth';
import { Paperclip, Phone, SendHorizonal, SmilePlus, UserPlusIcon, Video } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

const Chats = () => {
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  const [chatUsers, setChatUsers] = useState<ChatUser[]>([
    {
      id: 2,
      name: 'Harshita Shrivastava',
      email: 'harshita@gmail.com',
      lastMsg: 'Hii, can we meet now?',
      lastMsgDate: new Date(),
      profile: 'https://ui-avatars.com/api/Harshita Shrivastava'
    },
    {
      id: 3,
      name: 'Amit Yadav',
      email: 'amit@gmail.com',
      lastMsg: 'Hello, how are you?',
      lastMsgDate: new Date(),
      profile: 'https://ui-avatars.com/api/Amit Yadav'
    },
    {
      id: 4,
      name: 'Priya Sharma',
      email: 'priya@gmail.com',
      lastMsg: 'What are you doing?',
      lastMsgDate: new Date(),
      profile: 'https://ui-avatars.com/api/Priya Sharma'
    },
    {
      id: 5,
      name: 'Rohan Verma',
      email: 'rohan@gmail.com',
      lastMsg: 'I am fine, thanks!',
      lastMsgDate: new Date(),
      profile: 'https://ui-avatars.com/api/Rohan Verma'
    },
    {
      id: 6,
      name: 'Sneha Patel',
      email: 'sneha@gmail.com',
      lastMsg: 'See you soon!',
      lastMsgDate: new Date(),
      profile: 'https://ui-avatars.com/api/Sneha Patel'
    },
    {
      id: 7,
      name: 'Vikram Singh',
      email: 'vikram@gmail.com',
      lastMsg: 'Good morning!',
      lastMsgDate: new Date(),
      profile: 'https://ui-avatars.com/api/Vikram Singh'
    },
    {
      id: 8,
      name: 'Ananya Gupta',
      email: 'ananya@gmail.com',
      lastMsg: 'Have a great day!',
      lastMsgDate: new Date(),
      profile: 'https://ui-avatars.com/api/Ananya Gupta'
    },
    {
      id: 9,
      name: 'Kunal Kapoor',
      email: 'kunal@gmail.com',
      lastMsg: 'How was your day?',
      lastMsgDate: new Date(),
      profile: 'https://ui-avatars.com/api/Kunal Kapoor'
    },
    {
      id: 10,
      name: 'Neha Choudhary',
      email: 'neha@gmail.com',
      lastMsg: 'I am going to the market.',
      lastMsgDate: new Date(),
      profile: 'https://ui-avatars.com/api/Neha Choudhary'
    },
    {
      id: 11,
      name: 'Rajesh Kumar',
      email: 'rajesh@gmail.com',
      lastMsg: 'Call me when you are free.',
      lastMsgDate: new Date(),
      profile: 'https://ui-avatars.com/api/Rajesh Kumar'
    },
    {
      id: 12,
      name: 'Shweta Mishra',
      email: 'shweta@gmail.com',
      lastMsg: 'I will be there in 10 minutes.',
      lastMsgDate: new Date(),
      profile: 'https://ui-avatars.com/api/Shweta Mishra'
    },
    {
      id: 13,
      name: 'Gaurav Sharma',
      email: 'gaurav@gmail.com',
      lastMsg: 'Let\'s plan something for the weekend.',
      lastMsgDate: new Date(),
      profile: 'https://ui-avatars.com/api/Gaurav Sharma'
    },
    {
      id: 14,
      name: 'Divya Singh',
      email: 'divya@gmail.com',
      lastMsg: 'I am waiting for your reply.',
      lastMsgDate: new Date(),
      profile: 'https://ui-avatars.com/api/Divya Singh'
    },
    {
      id: 15,
      name: 'Manish Verma',
      email: 'manish@gmail.com',
      lastMsg: 'Can you help me with this?',
      lastMsgDate: new Date(),
      profile: 'https://ui-avatars.com/api/Manish Verma'
    },
  ]);

  const escFunction = useCallback((event: KeyboardEvent) => {
    if (event.key === "Escape") {
      setSelectedUser(null);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", escFunction, false);
    return () => {
      document.removeEventListener("keydown", escFunction, false);
    };
  }, [escFunction]);

  return (
    <SidebarProvider>
      <ChatSidebar chatUsers={chatUsers} selectedUser={selectedUser} setSelectedUser={setSelectedUser} />

      <div className="h-screen w-full">
        {selectedUser ? (
          <ChatScreen selectedUser={selectedUser} />
        ) : (
          <NotSelectedScreen />
        )}
      </div>
    </SidebarProvider>
  )
}

type ChatScreenProps = {
  selectedUser: ChatUser
}
function ChatScreen({ selectedUser }: ChatScreenProps) {
  const [typeMsg, setTypeMsg] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([
    { "id": 1, "message": "Hey!", "isSender": true },
    { "id": 2, "message": "Hey! How’s your day going so far?", "isSender": false },
    { "id": 3, "message": "Pretty good! Just working on some code.", "isSender": true },
    { "id": 4, "message": "Nice! What are you working on?", "isSender": false },
    { "id": 5, "message": "A chat app, actually!", "isSender": true },
    { "id": 6, "message": "Oh cool! Are you using Flutter for it?", "isSender": false },
    { "id": 7, "message": "Yeah, Flutter with Firebase for real-time updates.", "isSender": true },
    {
      "id": 8,
      "message": "That’s awesome! I’ve been meaning to learn Flutter. I hear it’s great for cross-platform development and makes UI building super smooth.",
      "isSender": false
    },
    { "id": 9, "message": "It really is! Hot reload is a lifesaver.", "isSender": true },
    { "id": 10, "message": "I bet! How’s the state management?", "isSender": false },
    {
      "id": 11,
      "message": "Right now, I’m using Riverpod. It’s pretty neat, and I find it more intuitive than Provider. Makes things more scalable.",
      "isSender": true
    },
    { "id": 12, "message": "Interesting! I’ll check it out.", "isSender": false },
    { "id": 13, "message": "Definitely worth a look!", "isSender": true },
    {
      "id": 14,
      "message": "By the way, are you implementing notifications as well? Would love to see how you handle push notifications.",
      "isSender": false
    },
    { "id": 15, "message": "Yeah! Using Firebase Cloud Messaging for that.", "isSender": true },
    {
      "id": 16,
      "message": "That’s great. I tried it once but ran into issues with iOS background notifications.",
      "isSender": false
    },
    {
      "id": 17,
      "message": "Yeah, iOS requires extra setup with APNs. Took me a while to get it working.",
      "isSender": true
    },
    { "id": 18, "message": "Sounds tricky.", "isSender": false },
    { "id": 19, "message": "It was, but now it works fine!", "isSender": true },
    { "id": 20, "message": "Awesome! Let me know if you need testers.", "isSender": false },
    { "id": 21, "message": "That would be great! I’ll send you a link soon.", "isSender": true },
    { "id": 22, "message": "Looking forward to it!", "isSender": false },
    {
      "id": 23,
      "message": "By the way, are you planning on adding media sharing? Like sending images or voice messages?",
      "isSender": false
    },
    { "id": 24, "message": "Yep! Working on image uploads right now.", "isSender": true },
    { "id": 25, "message": "Nice! Firebase Storage?", "isSender": false },
    { "id": 26, "message": "Exactly! Uploading images there and storing the URLs in Firestore.", "isSender": true },
    { "id": 27, "message": "Smart approach!", "isSender": false },
    {
      "id": 28,
      "message": "Yeah, trying to keep it simple but scalable. Might add video messages later too.",
      "isSender": true
    },
    { "id": 29, "message": "That would be really cool!", "isSender": false },
    { "id": 30, "message": "Let’s see how it goes!", "isSender": true },
    {
      "id": 31,
      "message": "Oh, I just remembered—are you handling user authentication with Firebase Auth?",
      "isSender": false
    },
    { "id": 32, "message": "Yep, Firebase Auth with Google sign-in.", "isSender": true },
    { "id": 33, "message": "That’s seamless for users!", "isSender": false },
    { "id": 34, "message": "Exactly, reduces friction.", "isSender": true },
    { "id": 35, "message": "Are you planning to add end-to-end encryption?", "isSender": false },
    {
      "id": 36,
      "message": "Eventually, yes! Might use something like Signal’s protocol for that.",
      "isSender": true
    },
    { "id": 37, "message": "That would be next-level security!", "isSender": false },
    { "id": 38, "message": "Yeah, privacy is key for chat apps.", "isSender": true },
    { "id": 39, "message": "Agreed!", "isSender": false },
    { "id": 40, "message": "Oh, gotta run now. Let’s catch up later!", "isSender": true },
    { "id": 41, "message": "No worries! Talk soon.", "isSender": false },
    { "id": 42, "message": "See ya!", "isSender": true },
    {
      "id": 43,
      "message": "Oh wait, before you go—do you have any good resources for learning advanced Flutter animations?",
      "isSender": false
    },
    {
      "id": 44,
      "message": "Yes! Check out the Flutter.dev animations guide and Rive for interactive animations. Also, there’s a great YouTube channel called Reso Coder that explains them well.",
      "isSender": true
    },
    { "id": 45, "message": "Awesome! I’ll check those out.", "isSender": false },
    { "id": 46, "message": "Cool, let me know if you need help!", "isSender": true },
    { "id": 47, "message": "Will do!", "isSender": false },
    { "id": 48, "message": "Alright, take care!", "isSender": true },
    { "id": 49, "message": "You too!", "isSender": false },
    { "id": 50, "message": "Bye!", "isSender": true }
  ]);

  const addMessage = (message: string) => {
    setMessages((prev) => ([
      ...prev,
      {
        id: prev.length + 1,
        message,
        isSender: true
      }
    ]));
    setTypeMsg('');
  }

  const chatRef = useRef(null);
  useEffect(() => {
    chatRef.current?.scrollIntoView();
  }, [selectedUser, messages]);
  return (
    <>
      <div className="fixed top-0 right-0 flex justify-between items-center px-4 py-3 bg-sidebar h-16 w-[calc(100%-20rem)] z-20">
        <div className="flex items-center gap-4">
          <UserAvatar userProfileOrName={selectedUser.profile ?? selectedUser.name} size='md' />
          <div className="flex flex-col justify-center">
            <p className='text-md line-clamp-1 font-bold'>{selectedUser.name}</p>
            <p className='text-xs'>Online</p>
          </div>
        </div>
        <div className="flex">
          <Button variant='outline' size='icon'>
            <Phone />
          </Button>
          <Button variant='outline' size='icon'>
            <Video />
          </Button>
        </div>
      </div>

      <div className="flex flex-col px-10 gap-2 py-20 bg-[url(/src/assets/chat-background.jpg)] bg-cover bg-fixed relative">
        <div className='absolute top-0 left-0 w-full h-full bg-black opacity-60 z-0'></div>
        {messages.map((message) => (
          <ChatBubble key={message.id} message={message} />
        ))}
        <div ref={chatRef}></div>
      </div>

      <div className="fixed bottom-0 right-0 flex justify-center items-center px-4 py-3 bg-sidebar h-16 w-[calc(100%-20rem)] z-20">
        <Button variant='outline' size='icon'>
          <Paperclip />
        </Button>
        <Button variant='outline' size='icon'>
          <SmilePlus />
        </Button>

        <Input placeholder='Type a message...' className='mx-2' value={typeMsg} onChange={(e) => setTypeMsg(e.target.value)} onKeyDown={e => {
          if (e.key === 'Enter') {
            addMessage(typeMsg);
          }
        }} />

        <Button disabled={!typeMsg} size='icon' onClick={() => addMessage(typeMsg)}>
          <SendHorizonal />
        </Button>
      </div>
    </>
  )
}

function NotSelectedScreen() {
  return (
    <div className='flex flex-col justify-center items-center w-full h-screen'>
      <UserPlusIcon className='w-20 h-20 text-muted' />
      <p className='text-md text-muted font-bold'>Select the user to chat</p>
    </div>
  );
}

export default Chats