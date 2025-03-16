export interface SignupRequest {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface User {
  id: number
  name: string
  email: string
  profile: string
  isOnline: boolean
}

export interface ChatUser extends User {
  lastMsg: string
  lastMsgDate: string
}

export interface Message {
  id: number
  message: string
  isSender: boolean
  replyTo: Message | null
  reactions: Reaction[]
  date: string
}

export interface Reaction {
  emojie: string
  user: User
}