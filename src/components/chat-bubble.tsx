import { Message, Reaction } from "@/types/auth"
import { Button } from "./ui/button"
import { Reply, Smile } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { PopoverClose } from "@radix-ui/react-popover"
import { useUser } from "@/context/UserContext"

type ChatBubbleProps = {
  message: Message,
  addReaction: (reaction: string, message: Message) => void,
  setReplyMsg: (msg: Message) => void
}
const ChatBubble = ({ message, addReaction, setReplyMsg }: ChatBubbleProps) => {
  const { user } = useUser();
  if (message.isSender) {
    return (
      <div className={`group flex flex-row items-start gap-1 ${message.reactions.length > 0 ? 'mb-4' : ''}`}>
        <div className="ml-auto"></div>
        <ActionButtons message={message} addReaction={addReaction} setReplyMsg={setReplyMsg} />

        <div className="flex w-max max-w-[75%] flex-col gap-1 rounded-lg pl-3 pr-12 py-2 text-sm bg-primary text-primary-foreground z-10 relative">
          {message.replyTo && (
            <div className="w-full flex justify-start items-center gap-2 bg-accent text-primary h-full rounded-md pl-2 pr-4 py-1">
              <div className="w-1 rounded-md bg-primary h-5"></div>
              <div className="flex flex-col">
                <h4 className="text-sm leading-4 font-bold">
                  {message.replyTo.senderId === user!.id ? "You" : message.replyTo.sender.name}
                </h4>
                <p className="text-xs line-clamp-1">{message.replyTo.message}</p>
              </div>
            </div>
          )}
          <p>{message.message}</p>
          <ChatTimestamp date={message.date} />
          {message.reactions.length > 0 && (<DisplayReactions reactions={message.reactions} isSender={message.isSender} />)}
        </div>
      </div>
    )
  } else {
    return (
      <div className={`group flex flex-row items-start gap-1 ${message.reactions.length > 0 ? 'mb-4' : ''}`}>
        <div className="flex w-max max-w-[75%] flex-col gap-2 rounded-lg pl-3 pr-12 py-2 text-sm bg-muted z-10 relative">
          {message.replyTo && (
            <div className="w-full flex justify-start items-center gap-2 bg-primary text-accent h-full rounded-md px-2 py-1">
              <div className="w-1 rounded-md bg-accent h-5"></div>
              <div className="flex flex-col">
                <h4 className="text-sm leading-4 font-bold">
                  {message.replyTo.senderId == user!.id ? "You" : message.replyTo.sender.name}
                </h4>
                <p className="text-xs line-clamp-1">{message.replyTo.message}</p>
              </div>
            </div>
          )}
          <p>{message.message}</p>
          <ChatTimestamp date={message.date} />
          {message.reactions.length > 0 && (<DisplayReactions reactions={message.reactions} isSender={message.isSender} />)}
        </div>

        <ActionButtons message={message} addReaction={addReaction} setReplyMsg={setReplyMsg} />
      </div>
    )
  }
}

type ActionButtonsProps = {
  message: Message,
  addReaction: (reaction: string, message: Message) => void,
  setReplyMsg: (msg: Message) => void
}
function ActionButtons({ message, addReaction, setReplyMsg }: ActionButtonsProps) {
  return (
    <>
      <Popover>
        <PopoverTrigger className="z-10" asChild>
          <Button variant="ghost" size="icon" className="z-20 transition-opacity opacity-0 group-hover:opacity-100" >
            <Smile className="h-5 w-5" />
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          <div className="overflow-y-auto flex flex-row gap-3">
            <PopoverClose onClick={() => addReaction('👍', message)} className="text-2xl cursor-pointer border border-transparent hover:border-gray-600 rounded-md">👍</PopoverClose>
            <PopoverClose onClick={() => addReaction('💓', message)} className="text-2xl cursor-pointer border border-transparent hover:border-gray-600 rounded-md">💓</PopoverClose>
            <PopoverClose onClick={() => addReaction('😊', message)} className="text-2xl cursor-pointer border border-transparent hover:border-gray-600 rounded-md">😊</PopoverClose>
            <PopoverClose onClick={() => addReaction('😂', message)} className="text-2xl cursor-pointer border border-transparent hover:border-gray-600 rounded-md">😂</PopoverClose>
            <PopoverClose onClick={() => addReaction('😎', message)} className="text-2xl cursor-pointer border border-transparent hover:border-gray-600 rounded-md">😎</PopoverClose>
            <PopoverClose onClick={() => addReaction('☹', message)} className="text-2xl cursor-pointer border border-transparent hover:border-gray-600 rounded-md">☹️</PopoverClose>
            <PopoverClose onClick={() => addReaction('😭', message)} className="text-2xl cursor-pointer border border-transparent hover:border-gray-600 rounded-md">😭</PopoverClose>
            <PopoverClose onClick={() => addReaction('🔥', message)} className="text-2xl cursor-pointer border border-transparent hover:border-gray-600 rounded-md">🔥</PopoverClose>
          </div>
        </PopoverContent>
      </Popover>
      <Button variant="ghost" size="icon" className="z-20 transition-opacity opacity-0 group-hover:opacity-100" onClick={() => setReplyMsg(message)}>
        <Reply className="h-5 w-5" />
      </Button>
    </>
  )
}

type ChatTimestampProps = { date: string }
function ChatTimestamp({ date }: ChatTimestampProps) {
  return (
    <span className="text-xs text-gray-400 absolute bottom-0.5 right-2">
      {new Date(date).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      })}
    </span>
  )
}

type DisplayReactionProps = { reactions: Reaction[], isSender: boolean }
function DisplayReactions({ reactions, isSender }: DisplayReactionProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <span className={`absolute -bottom-[1.1rem] ${isSender ? 'right-2' : 'left-2'} bg-white border rounded-xl px-1 select-none cursor-pointer`}>
          {reactions.map((reaction, index) => (
            <span key={index}>{reaction.emojie}</span>
          ))}
        </span>
      </PopoverTrigger>
      <PopoverContent className="p-1">
        <div className="flex flex-col gap-2">
          {reactions.map((reaction, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2 hover:bg-zinc-800 rounded-md cursor-pointer border"
            >
              <div className="flex items-center space-x-3">
                <img src={reaction.user.profile!=null?"http://127.0.0.1:8000/uploads/"+reaction.user.profile:`https://ui-avatars.com/api/?background=222&color=fff&name=${reaction.user.name}`} className='w-14 h-14 rounded-full object-cover' />
                <div>
                  <p className="text-sm font-medium">{reaction.user.name}</p>
                  <p className="text-xs text-gray-500">{reaction.user.email}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default ChatBubble