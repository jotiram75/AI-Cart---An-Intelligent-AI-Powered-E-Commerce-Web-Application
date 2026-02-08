import React, { useState } from 'react'
import { IoAddCircleOutline, IoListOutline, IoReceiptOutline } from "react-icons/io5";
import { useNavigate, useLocation } from 'react-router-dom';

function Sidebar({ showMobileMenu, setShowMobileMenu }) {
    let navigate = useNavigate()
    let location = useLocation()
    
    const menuItems = [
        {
            icon: IoAddCircleOutline,
            label: 'Add Items',
            path: '/add'
        },
        {
            icon: IoListOutline,
            label: 'List Items',
            path: '/lists'
        },
        {
            icon: IoReceiptOutline,
            label: 'View Orders',
            path: '/orders'
        }
    ]

    const handleNavigation = (path) => {
        navigate(path)
        if (setShowMobileMenu) {
            setShowMobileMenu(false)
        }
    }

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className='w-64 min-h-screen bg-white border-r border-gray-200 fixed left-0 top-[70px] pt-8 hidden md:block z-40'>
                <nav className='flex flex-col gap-2 px-4'>
                    {menuItems.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => handleNavigation(item.path)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                                location.pathname === item.path
                                    ? 'bg-gray-900 text-white shadow-md'
                                    : 'text-gray-700 hover:bg-gray-100 active:bg-gray-200'
                            }`}
                        >
                            <item.icon className='w-5 h-5' />
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>
            </aside>

            {/* Mobile Sidebar */}
            <aside className={`md:hidden fixed left-0 top-[70px] w-64 h-full bg-white border-r border-gray-200 pt-8 z-50 transition-transform duration-300 ${
                showMobileMenu ? 'translate-x-0' : '-translate-x-full'
            }`}>
                <nav className='flex flex-col gap-2 px-4'>
                    {menuItems.map((item, index) => (
                        <button
                            key={index}
                            onClick={() => handleNavigation(item.path)}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                                location.pathname === item.path
                                    ? 'bg-gray-900 text-white shadow-md'
                                    : 'text-gray-700 hover:bg-gray-100 active:bg-gray-200'
                            }`}
                        >
                            <item.icon className='w-5 h-5' />
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>
            </aside>
        </>
    )
}

export default Sidebar
