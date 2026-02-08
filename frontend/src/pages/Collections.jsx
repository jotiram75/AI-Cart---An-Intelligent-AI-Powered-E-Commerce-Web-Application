import React, { useContext, useEffect, useState } from 'react';
import { IoChevronDown, IoClose, IoFunnelOutline } from "react-icons/io5";
import Title from '../component/Title';
import { shopDataContext } from '../context/ShopContext';
import Card from '../component/Card';
import Footer from '../component/Footer';

function Collections() {
    const { products, search, showSearch } = useContext(shopDataContext);
    const [showFilter, setShowFilter] = useState(false);
    const [filterProduct, setFilterProduct] = useState([]);
    const [category, setCategory] = useState([]);
    const [subCategory, setSubCategory] = useState([]);
    const [sortType, setSortType] = useState('relevant');

    const toggleCategory = (e) => {
        if (category.includes(e.target.value)) {
            setCategory(prev => prev.filter(item => item !== e.target.value));
        } else {
            setCategory(prev => [...prev, e.target.value]);
        }
    };

    const toggleSubCategory = (e) => {
        if (subCategory.includes(e.target.value)) {
            setSubCategory(prev => prev.filter(item => item !== e.target.value));
        } else {
            setSubCategory(prev => [...prev, e.target.value]);
        }
    };

    const applyFilter = () => {
        let productsCopy = products.slice();

        if (showSearch && search) {
            productsCopy = productsCopy.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));
        }

        if (category.length > 0) {
            productsCopy = productsCopy.filter(item => category.includes(item.category));
        }

        if (subCategory.length > 0) {
            productsCopy = productsCopy.filter(item => subCategory.includes(item.subCategory));
        }

        setFilterProduct(productsCopy);
    };

    const sortProduct = () => {
        let fpCopy = filterProduct.slice();

        switch (sortType) {
            case 'low-high':
                setFilterProduct(fpCopy.sort((a, b) => a.price - b.price));
                break;
            case 'high-low':
                setFilterProduct(fpCopy.sort((a, b) => b.price - a.price));
                break;
            default:
                applyFilter();
                break;
        }
    };

    useEffect(() => {
        applyFilter();
    }, [category, subCategory, search, showSearch, products]);

    useEffect(() => {
        sortProduct();
    }, [sortType]);

    return (
        <div className='min-h-screen bg-white pt-20 md:pt-24'>
            <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12'>
                
                {/* Header Section */}
                <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8'>
                    <div>
                        <Title text1={'ALL'} text2={'COLLECTIONS'} />
                        <p className='text-sm text-gray-600 mt-2'>
                            Showing {filterProduct.length} products
                        </p>
                    </div>

                    <div className='flex items-center gap-4'>
                        {/* Mobile Filter Toggle */}
                        <button
                            onClick={() => setShowFilter(!showFilter)}
                            className='md:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'
                        >
                            <IoFunnelOutline className='w-5 h-5' />
                            <span className='text-sm font-medium'>Filters</span>
                        </button>

                        {/* Sort Dropdown */}
                        <div className='relative'>
                            <select
                                onChange={(e) => setSortType(e.target.value)}
                                className='px-4 py-2 pr-10 border border-gray-300 rounded-lg text-sm font-medium appearance-none bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer transition-colors'
                            >
                                <option value="relevant">Sort: Relevant</option>
                                <option value="low-high">Price: Low to High</option>
                                <option value="high-low">Price: High to Low</option>
                            </select>
                            <IoChevronDown className='absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none' />
                        </div>
                    </div>
                </div>

                <div className='flex flex-col md:flex-row gap-8'>
                    
                    {/* Sidebar Filters - Desktop */}
                    <aside className='hidden md:block w-64 flex-shrink-0'>
                        <div className='sticky top-24 space-y-6'>
                            
                            {/* Category Filter */}
                            <div className='bg-white border border-gray-200 rounded-lg p-5'>
                                <h3 className='text-base font-bold text-gray-900 mb-4 uppercase tracking-wide'>
                                    Categories
                                </h3>
                                <div className='space-y-3'>
                                    {['Men', 'Women', 'Kids'].map((cat) => (
                                        <label key={cat} className='flex items-center gap-3 cursor-pointer group'>
                                            <input
                                                className='w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary cursor-pointer'
                                                type='checkbox'
                                                value={cat}
                                                onChange={toggleCategory}
                                            />
                                            <span className='text-sm text-gray-700 group-hover:text-primary transition-colors'>
                                                {cat}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Type Filter */}
                            <div className='bg-white border border-gray-200 rounded-lg p-5'>
                                <h3 className='text-base font-bold text-gray-900 mb-4 uppercase tracking-wide'>
                                    Type
                                </h3>
                                <div className='space-y-3'>
                                    {['Topwear', 'Bottomwear', 'Winterwear'].map((type) => (
                                        <label key={type} className='flex items-center gap-3 cursor-pointer group'>
                                            <input
                                                className='w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary cursor-pointer'
                                                type='checkbox'
                                                value={type}
                                                onChange={toggleSubCategory}
                                            />
                                            <span className='text-sm text-gray-700 group-hover:text-primary transition-colors'>
                                                {type}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Clear Filters */}
                            {(category.length > 0 || subCategory.length > 0) && (
                                <button
                                    onClick={() => {
                                        setCategory([]);
                                        setSubCategory([]);
                                    }}
                                    className='w-full px-4 py-2 text-sm font-medium text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors'
                                >
                                    Clear All Filters
                                </button>
                            )}
                        </div>
                    </aside>

                    {/* Mobile Filter Overlay */}
                    {showFilter && (
                        <div className='fixed inset-0 z-50 md:hidden'>
                            <div className='absolute inset-0 bg-black bg-opacity-50' onClick={() => setShowFilter(false)} />
                            <div className='absolute right-0 top-0 bottom-0 w-80 max-w-full bg-white shadow-xl overflow-y-auto'>
                                <div className='p-6'>
                                    <div className='flex items-center justify-between mb-6'>
                                        <h2 className='text-lg font-bold text-gray-900'>Filters</h2>
                                        <button
                                            onClick={() => setShowFilter(false)}
                                            className='p-2 hover:bg-gray-100 rounded-full transition-colors'
                                        >
                                            <IoClose className='w-6 h-6' />
                                        </button>
                                    </div>

                                    {/* Category Filter */}
                                    <div className='mb-6'>
                                        <h3 className='text-base font-bold text-gray-900 mb-4 uppercase tracking-wide'>
                                            Categories
                                        </h3>
                                        <div className='space-y-3'>
                                            {['Men', 'Women', 'Kids'].map((cat) => (
                                                <label key={cat} className='flex items-center gap-3 cursor-pointer'>
                                                    <input
                                                        className='w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary'
                                                        type='checkbox'
                                                        value={cat}
                                                        onChange={toggleCategory}
                                                        checked={category.includes(cat)}
                                                    />
                                                    <span className='text-sm text-gray-700'>{cat}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Type Filter */}
                                    <div className='mb-6'>
                                        <h3 className='text-base font-bold text-gray-900 mb-4 uppercase tracking-wide'>
                                            Type
                                        </h3>
                                        <div className='space-y-3'>
                                            {['Topwear', 'Bottomwear', 'Winterwear'].map((type) => (
                                                <label key={type} className='flex items-center gap-3 cursor-pointer'>
                                                    <input
                                                        className='w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary'
                                                        type='checkbox'
                                                        value={type}
                                                        onChange={toggleSubCategory}
                                                        checked={subCategory.includes(type)}
                                                    />
                                                    <span className='text-sm text-gray-700'>{type}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Apply & Clear Buttons */}
                                    <div className='space-y-3'>
                                        <button
                                            onClick={() => setShowFilter(false)}
                                            className='w-full px-4 py-3 bg-primary text-white rounded-lg font-medium hover:bg-gray-900 transition-colors'
                                        >
                                            Apply Filters
                                        </button>
                                        {(category.length > 0 || subCategory.length > 0) && (
                                            <button
                                                onClick={() => {
                                                    setCategory([]);
                                                    setSubCategory([]);
                                                }}
                                                className='w-full px-4 py-3 text-red-600 border border-red-600 rounded-lg font-medium hover:bg-red-50 transition-colors'
                                            >
                                                Clear All Filters
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Products Grid */}
                    <div className='flex-1'>
                        {filterProduct.length > 0 ? (
                            <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6'>
                                {filterProduct.map((item, index) => (
                                    <Card key={index} name={item.name} id={item._id} price={item.price} image={item.image1} />
                                ))}
                            </div>
                        ) : (
                            <div className='flex flex-col items-center justify-center py-20 text-center'>
                                <div className='w-20 h-20 mb-4 text-gray-300'>
                                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                    </svg>
                                </div>
                                <h3 className='text-xl font-bold text-gray-900 mb-2'>No products found</h3>
                                <p className='text-gray-600 mb-6'>Try adjusting your filters or search terms</p>
                                <button
                                    onClick={() => {
                                        setCategory([]);
                                        setSubCategory([]);
                                    }}
                                    className='px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-gray-900 transition-colors'
                                >
                                    Clear Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default Collections;