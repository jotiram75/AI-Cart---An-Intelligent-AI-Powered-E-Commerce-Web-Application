import React, { createContext, useContext, useEffect, useState } from 'react'
import { authDataContext } from './AuthContext'
import axios from 'axios'

export const adminDataContext = createContext()
function AdminContext({children}) {
    let [adminData,setAdminData] = useState(null)
    let [token, setToken] = useState(localStorage.getItem('token') || '')
    let {serverUrl} = useContext(authDataContext)


    const getAdmin = async () => {
      if (!token) return;
      try {
           let result = await axios.get(serverUrl + "/api/vendor/profile",{
               headers: { token }
           })

           if (result.data.success) {
               setAdminData(result.data.vendor)
           } else {
               setAdminData(null)
               setToken('')
               localStorage.removeItem('token')
           }
      } catch (error) {
        setAdminData(null)
        setToken('')
        localStorage.removeItem('token')
        console.log(error)
      }
    }

    useEffect(()=>{
     if (token) {
         localStorage.setItem('token', token)
         getAdmin()
     } else {
         localStorage.removeItem('token')
         setAdminData(null)
     }
    },[token])


    let value = {
adminData,setAdminData,getAdmin, token, setToken
    }
  return (
    <div>
<adminDataContext.Provider value={value}>
    {children}
</adminDataContext.Provider>
      
    </div>
  )
}

export default AdminContext