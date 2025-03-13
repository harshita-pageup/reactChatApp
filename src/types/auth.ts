export interface SignupRequest {
  name: string
  email: string
  contact: string
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
}

export interface ChatUser {
  id: number
  name: string
  email: string
  profile: string
  lastMsg: string
  lastMsgDate: Date
}

export interface Message {
  id: number
  message: string
  isSender: boolean
}