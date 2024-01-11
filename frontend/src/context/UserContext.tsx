import { User } from '@/types'
import { useReducer, useContext, createContext } from 'react'

type Action = { 
  type: 'LOG_IN' 
  payload: User
} | { type: 'LOG_OUT' }

type Dispatch = (action: Action) => void

type State = User | null

type Props = { children: React.ReactNode }

export type UserDispatch = React.Dispatch<Action>

const UserContext = createContext<
  { user: State; dispatch: Dispatch } | undefined
>(undefined)

function userReducer(user: State, action: Action) {
  switch (action.type) {
    case 'LOG_IN': {
      return action.payload
    }
    case 'LOG_OUT': {
      return null
    }
    default:
     return user
  }
}

export function UserProvider(props: Props) {
  const { children } = props
  const [user, dispatch] = useReducer(userReducer, null)

  // TODO: read kent's blog on how to memoize this value
  const value = {
    user,
    dispatch
  }

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}

// actions
export function loginUser(user: User, dispatch: UserDispatch) {
  dispatch({
    type: 'LOG_IN',
    payload: user
  })
}

export function logoutUser(dispatch: UserDispatch) {
  dispatch({
    type: 'LOG_OUT',
  })
}
