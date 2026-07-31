import { createContext } from 'react'

export const MEMBERSHIP = {
  NONE: 'none',
  BASIC: 'basic'
}

export const ROLE = {
  MEMBER: 'Client',
  TRAINER: 'Trainer',
  ADMIN: 'Admin'
}

export const AuthContext = createContext({
  user: null,
  handleLogin: () => {},
  handleLogout: () => {},
  handleUpdateUser: () => {},
  handleNewMembership: () => {},
  handleCancelMembership: () => {},
  handleNewPayment: () => {},
  handleEnrollClass: () => {},
  handleDisenrollClass: () => {},
})
