import axiosInstance from '@/api/axiosInstance';
import ChatBubble from '@/components/chat-bubble';
import { ChatSidebar } from '@/components/chat-sidebar'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SidebarProvider } from '@/components/ui/sidebar'
import UserAvatar from '@/components/user-avatar';
import { ChatUser, Message } from '@/types/auth';
import { Paperclip, Phone, SendHorizonal, SmilePlus, UserPlusIcon, Video, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

const Chats = () => {
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  const [chatUsers, setChatUsers] = useState<ChatUser[]>([]);

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

  // Fetch chat users from the API
  useEffect(() => {
    const fetchChatUsers = async () => {
      try {
        const response = await axiosInstance.post(`/api/users`, {page:1, perPage:15});
        const data = response.data.data.data;
        setChatUsers(data);
      } catch (error) {
        console.error('Error fetching chat users:', error);
      }
    };
    fetchChatUsers();
  }, []);

  return (
    <SidebarProvider>
      <ChatSidebar chatUsers={chatUsers} selectedUser={selectedUser} setSelectedUser={setSelectedUser} />

      <div className="h-screen w-[calc(100%-20rem)]">
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
  const [replyMsg, setReplyMsg] = useState<Message | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<Record<string, Message[]>>({
    "2025-03-10": [
      { id: 1, message: "Hey Olivia, are you free this afternoon?", isSender: true, replyTo: null, reactions: [{ emojie: "👍", user: { id: 2, name: "Isabella Nguyen", email: "isabella.nguyen@email.com", profile: "https://example.com/profiles/isabella.jpg" } }], date: "2025-03-10T09:00:00Z" },
      { id: 2, message: "Yes, I’m free! Let’s meet at 2 PM.", isSender: false, replyTo: { id: 2, message: "Yes, I’m free! Let’s meet at 2 PM.", isSender: false, replyTo: null, reactions: [], date: "2025-03-10T09:05:00Z" }, reactions: [{ emojie: "😊", user: { id: 1, name: "Olivia Martin", email: "m@example.com", profile: "https://example.com/profiles/olivia.jpg" } }], date: "2025-03-10T09:05:00Z" },
      { id: 3, message: "Sounds good! See you then.", isSender: true, replyTo: { id: 2, message: "Yes, I’m free! Let’s meet at 2 PM.", isSender: false, replyTo: null, reactions: [], date: "2025-03-10T09:05:00Z" }, reactions: [], date: "2025-03-10T09:10:00Z" },
      { id: 4, message: "Hey Jackson, can you join us?", isSender: true, replyTo: null, reactions: [{ emojie: "🙌", user: { id: 3, name: "Emma Wilson", email: "emma@example.com", profile: "https://example.com/profiles/emma.jpg" } }], date: "2025-03-10T09:15:00Z" },
      { id: 5, message: "Sure, I’ll be there!", isSender: false, replyTo: null, reactions: [{ emojie: "🎉", user: { id: 4, name: "Jackson Lee", email: "lee@example.com", profile: "https://example.com/profiles/jackson.jpg" } }], date: "2025-03-10T09:20:00Z" },
      { id: 6, message: "Great, looking forward to it!", isSender: true, replyTo: null, reactions: [], date: "2025-03-10T09:25:00Z" },
      { id: 7, message: "Me too! Should we bring anything?", isSender: false, replyTo: null, reactions: [{ emojie: "🤔", user: { id: 5, name: "William Kim", email: "will@email.com", profile: "https://example.com/profiles/william.jpg" } }], date: "2025-03-10T09:30:00Z" },
      { id: 8, message: "Maybe some snacks?", isSender: true, replyTo: { id: 7, message: "Me too! Should we bring anything?", isSender: false, replyTo: null, reactions: [], date: "2025-03-10T09:30:00Z" }, reactions: [], date: "2025-03-10T09:35:00Z" },
      { id: 9, message: "Good idea! I’ll bring chips.", isSender: false, replyTo: null, reactions: [{ emojie: "🍕", user: { id: 2, name: "Isabella Nguyen", email: "isabella.nguyen@email.com", profile: "https://example.com/profiles/isabella.jpg" } }], date: "2025-03-10T09:40:00Z" },
      { id: 10, message: "I’ll bring soda.", isSender: true, replyTo: null, reactions: [], date: "2025-03-10T09:45:00Z" }
    ],
    "2025-03-11": [
      { id: 11, message: "Perfect, see you all at 2!", isSender: false, replyTo: null, reactions: [{ emojie: "👌", user: { id: 1, name: "Olivia Martin", email: "m@example.com", profile: "https://example.com/profiles/olivia.jpg" } }], date: "2025-03-11T09:50:00Z" },
      { id: 12, message: "Can’t wait!", isSender: true, replyTo: null, reactions: [], date: "2025-03-11T09:55:00Z" },
      { id: 13, message: "Me neither!", isSender: false, replyTo: null, reactions: [{ emojie: "😄", user: { id: 3, name: "Emma Wilson", email: "emma@example.com", profile: "https://example.com/profiles/emma.jpg" } }], date: "2025-03-11T10:00:00Z" },
      { id: 14, message: "Let’s make it fun!", isSender: true, replyTo: null, reactions: [], date: "2025-03-11T10:05:00Z" },
      { id: 15, message: "Definitely!", isSender: false, replyTo: null, reactions: [{ emojie: "🎈", user: { id: 4, name: "Jackson Lee", email: "lee@example.com", profile: "https://example.com/profiles/jackson.jpg" } }], date: "2025-03-11T10:10:00Z" },
      { id: 16, message: "Any games in mind?", isSender: true, replyTo: null, reactions: [], date: "2025-03-11T10:15:00Z" },
      { id: 17, message: "How about charades?", isSender: false, replyTo: null, reactions: [{ emojie: "🎭", user: { id: 5, name: "William Kim", email: "will@email.com", profile: "https://example.com/profiles/william.jpg" } }], date: "2025-03-11T10:20:00Z" },
      { id: 18, message: "Love that idea!", isSender: true, replyTo: { id: 17, message: "How about charades?", isSender: false, replyTo: null, reactions: [], date: "2025-03-11T10:20:00Z" }, reactions: [], date: "2025-03-11T10:25:00Z" },
      { id: 19, message: "I’m in!", isSender: false, replyTo: null, reactions: [{ emojie: "🙋", user: { id: 2, name: "Isabella Nguyen", email: "isabella.nguyen@email.com", profile: "https://example.com/profiles/isabella.jpg" } }], date: "2025-03-11T10:30:00Z" },
      { id: 20, message: "Awesome, let’s do it!", isSender: true, replyTo: null, reactions: [], date: "2025-03-11T10:35:00Z" }
    ]
  });

  const addMessage = async (message: string, receiverId: number) => {
    if (!message.trim()) return; // Prevent empty messages
    let date = new Date().toISOString().split('T')[0];

    try {
      const response = await axiosInstance.post(`/api/sendMessage`, {message, receiverId});
      if (response.data.status) {
        setMessages((prev) => {
          const updatedMessages = { ...prev };
          if (!updatedMessages[date]) {
            updatedMessages[date] = [];
          }
          updatedMessages[date] = [
            ...updatedMessages[date],
            {
              id: Math.random(),
              message,
              isSender: true,
              replyTo: replyMsg,
              reactions: [],
              date: new Date().toISOString(),
            },
          ];
          return updatedMessages;
        });
        
        setTypeMsg('');
        setReplyMsg(null);
      } 
      else {
        setError(response.data.msg);
      }
    } catch (err: any) {
      setError(err?.message || "An unknown error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const addReaction = (reaction: string, message: Message) => {
    let date = new Date(message.date).toISOString().split('T')[0];
    let currentUser = {
      id: 1,
      name: 'Abhinav Namdeo',
      email: 'abhaynam22@gmail.com',
      profile: ''
    }
    setMessages((prev) => {
      const updatedMessages = { ...prev };
      const messageToUpdate = updatedMessages[date]?.find((msg) => msg.id === message.id);

      if (messageToUpdate) {
        const existingReactionIndex = messageToUpdate.reactions.findIndex(
          (r) => r.user.email === currentUser.email // Or use r.user.id === currentUser.id
        );

        if (existingReactionIndex !== -1) {
          messageToUpdate.reactions = [
            ...messageToUpdate.reactions.slice(0, existingReactionIndex),
            {
              ...messageToUpdate.reactions[existingReactionIndex],
              emojie: reaction,
            },
            ...messageToUpdate.reactions.slice(existingReactionIndex + 1),
          ];
        } else {
          messageToUpdate.reactions = [
            ...messageToUpdate.reactions,
            {
              emojie: reaction,
              user: {
                id: currentUser.id,
                name: currentUser.name,
                email: currentUser.email,
                profile: currentUser.profile || '',
              },
            },
          ];
        }

        updatedMessages[date] = updatedMessages[date].map((msg) =>
          msg.id === message.id ? { ...msg } : msg
        );
      }

      return updatedMessages;
    })
  }

  const chatRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    chatRef.current?.scrollIntoView();
  }, [selectedUser, messages]);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault(); // Prevent form submission or key event bubbling
    if (typeMsg.trim()) {
      addMessage(typeMsg, selectedUser.id);
    }
  };
  return (
    <>
      <div className="fixed top-0 right-0 flex justify-between items-center px-4 py-3 bg-sidebar h-16 w-[calc(100%-20rem)] z-20">
        <div className="flex items-center gap-4">
          <UserAvatar userProfileOrName={selectedUser.profile || selectedUser.name} size="md" />
          <div className="flex flex-col justify-center">
            <p className="text-md line-clamp-1 font-bold">{selectedUser.name}</p>
            <p className="text-xs">online</p>
          </div>
        </div>
        <div className="flex">
          <Button variant="outline" size="icon">
            <Phone />
          </Button>
          <Button variant="outline" size="icon">
            <Video />
          </Button>
        </div>
      </div>

      <div className="flex flex-col px-10 gap-2 py-20 bg-[url(/src/assets/chat-background.jpg)] bg-cover bg-fixed relative">
        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-60 z-0"></div>
        {Object.entries(messages).map(([date, dateMessages], index) => (
          <div key={index} className='flex flex-col gap-2'>
            <div className="text-center text-xs my-1.5 bg-zinc-500 w-min text-nowrap py-1 px-2 rounded-md text-white mx-auto">
              {new Date(date).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
            {dateMessages.map((message) => (
              <ChatBubble
                key={message.id}
                message={message}
                addReaction={addReaction}
                setReplyMsg={setReplyMsg}
              />
            ))}
          </div>
        ))}
        <div ref={chatRef}></div>
      </div>

      <div className="fixed bottom-0 right-0 w-[calc(100%-20rem)] z-20 bg-sidebar">
        {replyMsg && (
          <div className="flex justify-center items-end px-4 h-12 pt-1.5 gap-2">
            <Button variant="outline" size="icon" onClick={() => setReplyMsg(null)}>
              <X />
            </Button>
            <div className="w-full flex justify-start items-center gap-2 bg-accent h-full rounded-md px-2 py-1">
              <div className="w-1 rounded-md bg-primary h-full my-2"></div>
              <div className="flex flex-col">
                <h4 className="text-sm leading-4 font-bold">
                  {replyMsg.isSender ? "You" : selectedUser.name}
                </h4>
                <p className="text-xs">{replyMsg.message}</p>
              </div>
            </div>
          </div>
        )}
        <form
          onSubmit={handleSendMessage}
          className="flex justify-center items-center px-4 h-14"
        >
          <Button variant="outline" size="icon">
            <Paperclip />
          </Button>
          <Button variant="outline" size="icon">
            <SmilePlus />
          </Button>
          <Input
            placeholder="Type a message..."
            className="mx-2"
            value={typeMsg}
            onChange={(e) => setTypeMsg(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) { // Allow Shift+Enter for new lines
                e.preventDefault(); // Prevent default Enter behavior
                handleSendMessage();
              }
            }}
          />
          <Button type="submit" disabled={!typeMsg} size="icon">
            <SendHorizonal />
          </Button>
        </form>
      </div>
    </>
  );
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
