import React, { useCallback, useContext } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Registration from './pages/Registration'
import Home from './pages/Home'
import Login from './pages/Login'
import Nav from './component/Nav'
import { userDataContext } from './context/UserContext'
import About from './pages/About'
import Collections from './pages/Collections'
import Product from './pages/Product'
import Contact from './pages/Contact'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import PlaceOrder from './pages/PlaceOrder'
import Order from './pages/Order'
import { ToastContainer } from 'react-toastify';
import NotFound from './pages/NotFound'
import Ai from './component/Ai'
import ScrollToTop from './component/ScrollToTop'
import Careers from './pages/Careers'
import Blog from './pages/Blog'
import GiftCards from './pages/GiftCards'
import Faq from './pages/Faq'
import Shipping from './pages/Shipping'
import Returns from './pages/Returns'
import SizeGuide from './pages/SizeGuide'
function App() {
let {userData} = useContext(userDataContext)
let location = useLocation()
  
  return (
    <>
    <ScrollToTop/>
    <ToastContainer />
    <Nav/>
      <Routes>

        <Route path='/login' 
        element={userData ? (<Navigate to={location.state?.from || "/"}/> ) 
        : (<Login/>)
          }/>

        <Route path='/signup' 
        element={userData ? (<Navigate to={location.state?.from || "/"}/> ) 
        : (<Registration/>)}/>

        <Route path='/' element={<Home/>} />
      
        <Route path='/about' element={<About/>} />

        <Route path='/collection' element={<Collections/>} />

        <Route path='/product' element={<Product/>} />

        <Route path='/contact' element={<Contact/>} />
        
        <Route path='/productdetail/:productId' element={<ProductDetail/>} />

        <Route path='/cart' 
        element={userData ? <Cart/> : <Navigate to="/login" state={{from: location.pathname}} /> }/>

          <Route path='/placeorder' 
        element={userData ? <PlaceOrder/> : <Navigate to="/login" state={{from: location.pathname}} /> }/>
         <Route path='/order' 
        element={userData ? <Order/> : <Navigate to="/login" state={{from: location.pathname}} /> }/>

        <Route path='/careers' element={<Careers />} />
        <Route path='/blog' element={<Blog />} />
        <Route path='/gift-cards' element={<GiftCards />} />
        <Route path='/faqs' element={<Faq />} />
        <Route path='/shipping' element={<Shipping />} />
        <Route path='/returns' element={<Returns />} />
        <Route path='/size-guide' element={<SizeGuide />} />

        <Route path='*' element={<NotFound/>}/>
      </Routes>
      <Ai/>
    </>
  )
}

export default App
