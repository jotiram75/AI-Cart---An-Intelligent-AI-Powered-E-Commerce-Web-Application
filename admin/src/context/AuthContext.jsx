import React, { createContext } from 'react'

export const authDataContext = createContext()
function AuthContext({children}) {
    let serverUrl = import.meta.env.VITE_SERVER_URL
    let frontendUrl = import.meta.env.VITE_FRONTEND_URL

    let value = {
      serverUrl, frontendUrl
    }
  return (
    <div>
        <authDataContext.Provider value={value}>
            {children}
        </authDataContext.Provider>
      
    </div>
  )
}

export default AuthContext
