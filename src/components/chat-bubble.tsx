import { Message } from "@/types/auth"

type ChatBubbleProps = {
  message: Message
}

const ChatBubble = ({ message }: ChatBubbleProps) => {
  if (message.isSender) {
    return (
      <div className="flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm ml-auto bg-primary text-primary-foreground z-10">{message.message}</div>
    )
  } else {
    return (
      <div className="flex w-max max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 text-sm bg-muted z-10">{message.message}</div>
    )
  }
}

export default ChatBubble