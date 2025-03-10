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