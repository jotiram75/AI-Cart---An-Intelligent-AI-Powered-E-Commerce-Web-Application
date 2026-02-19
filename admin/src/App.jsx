import React, { useContext } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Add from './pages/Add'
import Lists from './pages/Lists'
import Edit from './pages/Edit'
import Orders from './pages/Orders'
import Login from './pages/Login'
import SellerLogin from './pages/SellerLogin'
import { adminDataContext } from './context/AdminContext'
  import { ToastContainer, toast } from 'react-toastify';

function App() {
  let {adminData} = useContext(adminDataContext)
  return (

    <>
      <ToastContainer />
      <Routes>
        <Route path='/seller-login' element={<SellerLogin />} />
        <Route path='/*' element={
          !adminData ? <Login /> : (
            <>
              <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/add' element={<Add />} />
                <Route path='/lists' element={<Lists />} />
                <Route path='/edit/:id' element={<Edit />} />
                <Route path='/orders' element={<Orders />} />
                <Route path='/login' element={<Login />} />
              </Routes>
            </>
          )
        } />
      </Routes>
    </>
  )
}

export default App
