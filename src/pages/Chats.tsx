import axiosInstance from '@/api/axiosInstance';
import ChatBubble from '@/components/chat-bubble';
import { ChatSidebar } from '@/components/chat-sidebar'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SidebarProvider } from '@/components/ui/sidebar'
import { useUser } from '@/context/UserContext';
import { ChatUser, Message, User } from '@/types/auth';
import { Loader2, Paperclip, Phone, SendHorizonal, SmilePlus, UserPlusIcon, Video, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import Pusher from 'pusher-js';
import { getToken } from '@/utils/auth';
import { useChatUsers } from '@/context/UserListContext';
import { BASE_URL, PUSHER_APP_CLUSTER, PUSHER_APP_KEY } from '@/api/enviornment';
import EmojiPicker, { Theme } from 'emoji-picker-react';

const Chats = () => {
  const { chatUsers, setChatUsers } = useChatUsers();
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  const [fetchListLoading, setFetchListLoading] = useState<boolean>(true);

  const pusher = new Pusher(PUSHER_APP_KEY, {
    cluster: PUSHER_APP_CLUSTER,
    authEndpoint: `${BASE_URL}/api/pusher/auth`,
    auth: {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
      }
    }
  });

  useEffect(() => {
    const channel = pusher.subscribe('presence-chat');

    channel.bind('pusher:subscription_succeeded', ({ members }: { members: any }) => {
      Object.keys(members).map((value: string) => {
        let onlineUser = members[value].user as User
        setChatUsers((prev) => {
          const updatedChatUsers = prev.map((user: any) => {
            if (user.id === onlineUser.id) {
              return { ...user, isOnline: true };
            }
            return user;
          });
          return updatedChatUsers;
        });
      })
    });

    channel.bind('pusher:member_added', (member: any) => {
      console.log("member added");
      setChatUsers((prev) => {
        const updatedChatUsers = prev.map((user: any) => {
          if (user.id === member.info.user.id) {
            return { ...user, isOnline: true };
          }
          return user;
        });
        return updatedChatUsers;
      });
    });

    channel.bind('pusher:member_removed', (member: any) => {
      console.log("member removed");
      setChatUsers((prev) => {
        const updatedChatUsers = prev.map((user: any) => {
          if (user.id === member.info.user.id) {
            return { ...user, isOnline: false };
          }
          return user;
        });
        return updatedChatUsers;
      });
    });

    return () => {
      pusher.unsubscribe('presence-chat');
    };
  }, []);

  const fetchChatUsers = async () => {
    setFetchListLoading(true);
    console.log('Entered into Chats::fetchChatUsers');
    try {
      const response = await axiosInstance.post(`/api/users`, { page: 1, perPage: 15 });
      const data = response.data.data.data;
      setChatUsers(data);
    } catch (error) {
      console.log('Error in Chats::fetchChatUsers ->', error);
    } finally {
      setFetchListLoading(false);
      console.log('Exited from Chats::fetchChatUsers');
    }
  };

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

  useEffect(() => {
    fetchChatUsers();
  }, []);

  return (
    <SidebarProvider>
      <ChatSidebar chatUsers={chatUsers} selectedUser={selectedUser} setSelectedUser={setSelectedUser} isLoading={fetchListLoading} />

      <div className="min-h-screen w-[calc(100%-20rem)]">
        {selectedUser ? (
          <ChatScreen selectedUser={selectedUser} chatUsers={chatUsers} />
        ) : (
          <NotSelectedScreen />
        )}
      </div>
    </SidebarProvider>
  )
}

type ChatScreenProps = {
  selectedUser: ChatUser,
  chatUsers: ChatUser[],
};

function ChatScreen({ selectedUser, chatUsers }: ChatScreenProps) {
  const [typeMsg, setTypeMsg] = useState<string>('');
  const [replyMsg, setReplyMsg] = useState<Message | null>(null);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [fetchMsgLoading, setFetchMsgLoading] = useState<boolean>(false);
  const [sendMsgLoading, setSendMsgLoading] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState(false);
  const userStatus = chatUsers.find((user) => user.id === selectedUser?.id);
  const [typingTxt, setTypingTxt] = useState((userStatus?.isOnline) ? 'online' : '');
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const emojieDivRef = useRef<HTMLDivElement>(null);
  const [lastMsgDate, setLastMsgDate] = useState<string>('');

  const { user } = useUser();
  const chatRef = useRef<HTMLDivElement>(null);

  const pusher = new Pusher(PUSHER_APP_KEY, {
    cluster: PUSHER_APP_CLUSTER
  });

  const updateTypingStatus = async (typing: boolean) => {
    console.log('Entered into ChatScreen::updateTypingStatus');
    try {
      await axiosInstance.post('/api/typingStatus', {
        userId: user!.id,
        isTyping: typing,
      });
    } catch (error) {
      console.log('Error in ChatScreen::updateTypingStatus ->', error);
    } finally {
      console.log('Exited from ChatScreen::updateTypingStatus');
    }
  };

  useEffect(() => {
    console.log('Updating the typeing status.')
    updateTypingStatus(isTyping);
  }, [isTyping]);

  useEffect(() => {
    console.log('Changing the user status');
    const userStatus = chatUsers.find((user) => user.id === selectedUser?.id);
    setTypingTxt((userStatus?.isOnline) ? 'online' : '')
  }, [chatUsers]);

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTypeMsg(e.target.value);

    if (!isTyping) {
      setIsTyping(true);
    }

    // Stop typing after a delay
    const typingTimeout = setTimeout(() => {
      setIsTyping(false);
    }, 2000);

    return () => clearTimeout(typingTimeout);
  };

  useEffect(() => {
    if (!selectedUser) return;

    fetchMessages(selectedUser.id);

    const channel = pusher.subscribe(`chat.${user!.id}.${selectedUser.id}`);
    channel.bind('new-message', ({ message }: { message: Message }) => {
      console.log('Pusher: Updating the new message.');
      let date = new Date().toLocaleString('sv').split(' ')[0];
      setMessages((prev) => {
        const updatedMessages = { ...prev };
        if (!updatedMessages[date]) {
          updatedMessages[date] = [];
        }
        // Check if the message id already exists for the current date
        const messageExists = updatedMessages[date].some(msg => msg.id === message.id);

        // If the message doesn't exist, add it to the array
        if (!messageExists) {
          updatedMessages[date] = [
            ...updatedMessages[date],
            {
              id: message.id,
              message: message.message,
              senderId: message.senderId,
              receiverId: message.receiverId,
              sender: message.sender,
              receiver: message.receiver,
              isSender: user!.id === message.senderId,
              replyTo: message.replyTo,
              reactions: [],
              date: date,
            },
          ];
        }
        return updatedMessages;
      });
    });

    const chatChannel = pusher.subscribe(`chat.${selectedUser.id}`);
    chatChannel.bind('user-typing', ({ isTyping }: { userId: number, isTyping: boolean }) => {
      console.log('Pusher: Updating the typing status.');
      setTypingTxt(isTyping ? 'typing...' : 'online');
    });

    const reactionChannel = pusher.subscribe(`reaction.${selectedUser.id}`);
    reactionChannel.bind('new-reaction', (data: { messageId: number; userId: number; emojie: string, user: User, date: string }) => {
      console.log('Pusher: Updating the reaction of the message.')
      let date = data.date;
      setMessages((prev) => {
        const updatedMessages = { ...prev };
        const messageToUpdate = updatedMessages[date]?.find((msg) => msg.id === data.messageId);

        if (messageToUpdate) {
          const existingReactionIndex = messageToUpdate.reactions.findIndex(
            (r) => r.user.id === data.userId
          );

          if (existingReactionIndex !== -1) {
            messageToUpdate.reactions = [
              ...messageToUpdate.reactions.slice(0, existingReactionIndex),
              {
                ...messageToUpdate.reactions[existingReactionIndex],
                emojie: data.emojie,
              },
              ...messageToUpdate.reactions.slice(existingReactionIndex + 1),
            ];
          } else {
            messageToUpdate.reactions = [
              ...messageToUpdate.reactions,
              {
                emojie: data.emojie,
                user: {
                  id: data.user!.id,
                  name: data.user!.name,
                  email: data.user!.email,
                  profile: data.user!.profile || '',
                  isOnline: false
                },
              },
            ];
          }

          updatedMessages[date] = updatedMessages[date].map((msg) =>
            msg.id === data.messageId ? { ...msg } : msg
          );
        }

        return updatedMessages;
      });
    });

    return () => {
      pusher.unsubscribe(`chat.${user!.id}.${selectedUser.id}`);
      pusher.unsubscribe(`chat.${selectedUser.id}`);
      pusher.unsubscribe(`reaction.${selectedUser.id}`);
    };
  }, [selectedUser]);

  const fetchMessages = async (userId: number) => {
    setFetchMsgLoading(true);
    console.log('Entered into ChatScreen::fetchMessages');
    try {
      const response = await axiosInstance.post(`/api/getMessages`, { receiverId: userId });
      if (response.data.status) {
        const messagesData = response.data.data;
        const updatedMessages: Record<string, Message[]> = {};
        messagesData.forEach((message: Message) => {
          const messageDate = message.date.split(' ')[0];
          if (!updatedMessages[messageDate]) {
            updatedMessages[messageDate] = [];
          }

          updatedMessages[messageDate].push({
            ...message
          });
        });
        setMessages(updatedMessages);
      }
    } catch (error) {
      console.log('Error in ChatScreen::fetchMessages ->', error);
    } finally {
      console.log('Exited from ChatScreen::fetchMessages');
      setFetchMsgLoading(false);
    }
  }

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (typeMsg.trim()) {
      addMessage(typeMsg, selectedUser.id);
      setIsTyping(false);
    }
  };

  const addMessage = async (message: string, receiverId: number) => {
    console.log('Entered into ChatScreen::addMessage');
    try {
      setSendMsgLoading(true);
      let date = new Date().toLocaleString('sv').split(' ')[0];
      let replyMsgId = replyMsg?.id
      const response = await axiosInstance.post(`/api/sendMessage`, { message, receiverId, replyMsgId });
      if (response.data.status) {
        setMessages((prev) => {
          const updatedMessages = { ...prev };
          if (!updatedMessages[date]) {
            updatedMessages[date] = [];
          }
          updatedMessages[date] = [
            ...updatedMessages[date],
            {
              id: response.data.data.message.id,
              message,
              senderId: response.data.data.message.senderId,
              receiverId: response.data.data.message.receiverId,
              sender: response.data.data.message.sender,
              receiver: response.data.data.message.receiver,
              isSender: true,
              replyTo: replyMsg,
              reactions: [],
              date: new Date().toLocaleString('sv'),
            },
          ];
          return updatedMessages;
        });

        setTypeMsg('');
        setReplyMsg(null);
      }
    } catch (error: any) {
      console.log('Errors in ChatScreen::addMessage ->', error);
    } finally {
      console.log('Exited from ChatScreen::addMessage');
      setSendMsgLoading(false);
    }
  }

  const addReaction = async (reaction: string, message: Message) => {
    console.log('Entered into ChatScreen::addReaction');
    try {
      let date = message.date.includes('T') ? message.date.split('T')[0] : message.date.split(' ')[0];

      try {
        const response = await axiosInstance.post('/api/storeReaction', {
          messageId: message.id,
          userId: user!.id,
          reaction: reaction
        });
        if (response.data.status) {
          setMessages((prev) => {
            const updatedMessages = { ...prev };
            const messageToUpdate = updatedMessages[date]?.find((msg) => msg.id === message.id);

            if (messageToUpdate) {
              const existingReactionIndex = messageToUpdate.reactions.findIndex(
                (r) => r.user.id === user!.id
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
                      id: user!.id,
                      name: user!.name,
                      email: user!.email,
                      profile: user!.profile || '',
                      isOnline: false
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
      } catch (error) {
        console.log('Error in addReaction API call ->', error);
      }

    } catch (error) {
      console.log('Error in ChatScreen::addReaction ->', error);
    } finally {
      console.log('Exited from ChatScreen::addReaction');
    }
  }

  useEffect(() => {
    const lastDateObj = messages[Object.keys(messages)[Object.keys(messages).length-1]];
    if (lastDateObj) {
      let lastDate = lastDateObj[lastDateObj.length-1];
      if (lastMsgDate !== undefined && lastMsgDate !== lastDate.date && (lastDate.isSender || lastMsgDate === '')) {
        chatRef.current?.scrollIntoView();
      }
      setLastMsgDate(lastDate.date)
    }
  }, [messages]);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (emojieDivRef.current && !emojieDivRef.current.contains(event.target)) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="fixed top-0 right-0 flex justify-between items-center px-4 py-3 bg-sidebar h-16 w-[calc(100%-20rem)] z-20">
        <div className="flex items-center gap-4">
          <img src={selectedUser.profile != null ? `${BASE_URL}/uploads/${selectedUser.profile}` : `https://ui-avatars.com/api/?background=222&color=fff&name=${selectedUser.name}`} className='w-12 h-12 rounded-full object-cover' />
          <div className="flex flex-col justify-center">
            <p className="text-md line-clamp-1 font-bold transition-all">{selectedUser.name}</p>
            <p className="text-xs">{typingTxt}</p>
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

      <div className={`flex flex-col px-10 gap-2 pt-18 pb-16 bg-[url(/src/assets/chat-background.jpg)] bg-cover bg-fixed h-full relative ${replyMsg ? 'mb-12' : ''}`}>
        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-60 z-0"></div>
        {fetchMsgLoading && (
          <div className="flex flex-col justify-center items-center h-full gap-2">
            <Loader2 className="h-12 w-12 animate-spin" />
            <p className='text-primary animate-pulse'>Loading the messages...</p>
          </div>
        )}
        {!fetchMsgLoading && Object.entries(messages).map(([date, dateMessages], index) => (
          <div key={index} className='flex flex-col gap-2'>
            <div className="text-center text-xs my-1.5 bg-zinc-500 w-min text-nowrap py-1 px-2 rounded-md text-white mx-auto">
              {new Date(date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
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
                <p className="text-xs line-clamp-1">{replyMsg.message}</p>
              </div>
            </div>
          </div>
        )}
        <form
          onSubmit={handleSendMessage}
          className="flex justify-center items-center px-4 h-14"
        >
          <Button variant="outline" size="icon" type='button'>
            <Paperclip />
          </Button>
          <Button variant="outline" size="icon" type='button' className='relative ml-1.5' onClick={() => { if (!showEmojiPicker) setShowEmojiPicker(true) }}>
            <div ref={emojieDivRef} className="absolute bottom-12 left-0">
              <EmojiPicker open={showEmojiPicker} theme={Theme.DARK} previewConfig={{ showPreview: false }} onEmojiClick={(event) => setTypeMsg(typeMsg + event.emoji)} />
            </div>
            <SmilePlus />
          </Button>
          <Input
            placeholder="Type a message..."
            className="mx-2"
            value={typeMsg}
            onChange={handleTyping}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button type="submit" disabled={!typeMsg.trim()} size="icon">
            {sendMsgLoading ? (
              <Loader2 className='animate-spin' />
            ) : (
              <SendHorizonal />
            )}
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
