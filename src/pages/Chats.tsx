import axiosInstance from '@/api/axiosInstance';
import { ChatSidebar } from '@/components/chat-sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import { useUser } from '@/context/UserContext';
import { ChatUser, User } from '@/types/auth';
import { UserPlusIcon} from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import Pusher from 'pusher-js';
import { getToken, removeToken } from '@/utils/auth';
import { useChatUsers } from '@/context/UserListContext';
import { BASE_URL, PUSHER_APP_CLUSTER, PUSHER_APP_KEY } from '@/api/enviornment';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router';
import ChatScreen from './ChatScreen';

const Chats = () => {
  const { chatUsers, setChatUsers } = useChatUsers();
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(null);
  const [fetchListLoading, setFetchListLoading] = useState<boolean>(true);
  const { user, setUser } = useUser();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const navigate = useNavigate();

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
    // const channel = pusher.subscribe('presence-chat');

    // channel.bind('pusher:subscription_succeeded', ({ members }: { members: any }) => {
    //   console.log('Pusher: Subscription succeeded.');
    //   Object.keys(members).map((value: string) => {
    //     let onlineUser = members[value].user as User
    //     setChatUsers((prev) => {
    //       const updatedChatUsers = prev.map((user: any) => {
    //         if (user.id === onlineUser.id) {
    //           return { ...user, isOnline: true };
    //         }
    //         return user;
    //       });
    //       return updatedChatUsers;
    //     });
    //   })
    // });

    // channel.bind('pusher:member_added', (member: any) => {
    //   console.log('Pusher: New member added.');
    //   setChatUsers((prev) => {
    //     const updatedChatUsers = prev.map((user: any) => {
    //       if (user.id === member.info.user.id) {
    //         return { ...user, isOnline: true };
    //       }
    //       return user;
    //     });
    //     return updatedChatUsers;
    //   });
    // });

    // channel.bind('pusher:member_removed', (member: any) => {
    //   console.log('Pusher: Member removed.');
    //   setChatUsers((prev) => {
    //     const updatedChatUsers = prev.map((user: any) => {
    //       if (user.id === member.info.user.id) {
    //         return { ...user, isOnline: false };
    //       }
    //       return user;
    //     });
    //     return updatedChatUsers;
    //   });
    // });

    return () => {
      // pusher.unsubscribe('presence-chat');
      if (user) {
        pusher.unsubscribe(`newMessage.${user!.id}`);
      }
    };
  }, [user]);

  const fetchChatUsers = async (pageNum: number, append: boolean = false) => {
    if (!append) {
      setFetchListLoading(true);
    }
    try {
      const response = await axiosInstance.post(`/api/users`, { page: pageNum, perPage: 15, search: searchQuery });
      const data = response.data.data.data;
      if (append) {
        setChatUsers((prev) => {
          const uniqueUserIds = new Set(prev.map((user) => user.id));
          const uniqueNewUsers = data.filter((user: any) => !uniqueUserIds.has(user.id));
          return [...prev, ...uniqueNewUsers];
        });
      } else {
        const uniqueUsers = Array.from(new Set(data.map((user: any) => user.id))).map((id) =>
          data.find((user: any) => user.id === id)
        );
        setChatUsers(uniqueUsers);
      }
      setHasMore(response.data.data.pagination.hasMorePages);
    } catch (error) {
      console.log('Error in Chats::fetchChatUsers ->', error);
    } finally {
      if (!append) {
        setFetchListLoading(false);
      }
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
    if (!hasMore || fetchListLoading) return;

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setPage((prev) => {
          const nextPage = prev + 1;
          fetchChatUsers(nextPage, true);
          return nextPage;
        });
      }
    });

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current!);
    }

    return () => {
      if (observerRef.current && loadMoreRef.current) {
        observerRef.current.unobserve(loadMoreRef.current);
      }
    };
  }, [hasMore, fetchListLoading]);

  useEffect(() => {
    setPage(1);
    setChatUsers([]);

    axiosInstance.get('/api/authUser').then(res => {
      setUser(res.data.data);
    }).catch((error: AxiosError) => {
      if (error.status === 401) {
          removeToken();
          setUser(null);
          navigate('/');
          return;
      }
    });
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setPage(1);
      setChatUsers([]);
      fetchChatUsers(1, false)
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  useEffect(() => {
    if (page > 1 && hasMore && !fetchListLoading) {
      fetchChatUsers(page, true)
    }
  }, [page]);

  return (
    <SidebarProvider>
      <ChatSidebar chatUsers={chatUsers} selectedUser={selectedUser} setSelectedUser={setSelectedUser} isLoading={fetchListLoading} loadMoreRef={loadMoreRef} hasMore={hasMore} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

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

function NotSelectedScreen() {
  return (
    <div className='flex flex-col justify-center items-center w-full h-screen'>
      <UserPlusIcon className='w-20 h-20 text-muted' />
      <p className='text-md text-muted font-bold'>Select the user to chat</p>
    </div>
  );
}

export default Chats
