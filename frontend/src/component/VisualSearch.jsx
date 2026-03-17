import React, { useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, X, Search, Loader2 } from 'lucide-react';
import Card from './Card';
import { authDataContext } from '../context/AuthContext';

const VisualSearch = ({ isOpen, onClose }) => {
    const { serverUrl } = useContext(authDataContext);
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
            setResults([]);
        }
    };

    const handleSearch = async () => {
        if (!image) {
            toast.error('Please select an image first');
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('image', image);

        try {
            const response = await axios.post(`${serverUrl}/api/ai/visual-search`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data.success) {
                setResults(response.data.results);
                if (response.data.results.length === 0) {
                    toast.info('No similar products found');
                }
            } else {
                toast.error(response.data.message || 'Search failed');
            }
        } catch (error) {
            console.error('Visual Search Error:', error);
            toast.error('Error performing visual search');
        } finally {
            setLoading(false);
        }
    };

    const clearSelection = () => {
        setImage(null);
        setPreview(null);
        setResults([]);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white dark:bg-gray-900 w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            >
                <div className="flex items-center justify-between p-6 border-b dark:border-gray-800">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                        <Camera className="w-6 h-6 text-pink-500" />
                        Visual Search
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                        <X className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Upload Section */}
                        <div className="w-full md:w-1/3">
                            {!preview ? (
                                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl cursor-pointer hover:border-pink-500 dark:hover:border-pink-500 transition-colors bg-gray-50 dark:bg-gray-800/50">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Upload className="w-10 h-10 text-gray-400 mb-3" />
                                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400 font-semibold text-center px-4">
                                            Click or drag image to search
                                        </p>
                                    </div>
                                    <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                                </label>
                            ) : (
                                <div className="relative group">
                                    <img src={preview} alt="Preview" className="w-full h-64 object-cover rounded-xl shadow-md" />
                                    <button 
                                        onClick={clearSelection}
                                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                    >
                                        <X size={16} />
                                    </button>
                                    <button 
                                        onClick={handleSearch}
                                        disabled={loading}
                                        className="w-full mt-4 py-3 bg-gradient-to-r from-pink-500 to-orange-400 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50"
                                    >
                                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search size={20} />}
                                        {loading ? 'Searching...' : 'Find Similar Products'}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Results Section */}
                        <div className="w-full md:w-2/3 border-t md:border-t-0 md:border-l dark:border-gray-800 p-4 min-h-[300px]">
                            {loading ? (
                                <div className="h-full flex flex-col items-center justify-center space-y-4">
                                    <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
                                    <p className="text-gray-500 animate-pulse">Analyzing image and matching products...</p>
                                </div>
                            ) : results.length > 0 ? (
                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                                    {results.map((product, index) => (
                                        <motion.div
                                            key={product._id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                        >
                                            <Card id={product._id} image={product.image1} name={product.name} price={product.price} />
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-gray-400 text-center">
                                    <Search size={48} strokeWidth={1} className="mb-4 opacity-20" />
                                    <p>Your search results will appear here</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default VisualSearch;
