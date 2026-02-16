import React from 'react'
import blog1 from '../assets/back1.jpg' 
import blog2 from '../assets/back2.jpg'
import blog3 from '../assets/back3.jpg'

const Blog = () => {
    const posts = [
        { id: 1, title: "How AI is Changing Fashion", category: "Technology", date: "Oct 12, 2024", image: blog1, excerpt: "Discover how artificial intelligence is personalizing your shopping experience." },
        { id: 2, title: "Summer Style Guide 2024", category: "Trends", date: "Sep 28, 2024", image: blog2, excerpt: "Top trends you need to know for the upcoming season." },
        { id: 3, title: "Sustainable Fashion Choices", category: "Eco", date: "Sep 15, 2024", image: blog3, excerpt: "Making better choices for the planet while looking great." },
    ];


  return (
    <div className='container mx-auto px-4 pt-24 pb-16'>
        <h1 className='text-3xl font-bold mb-12 text-center'>The AICart Blog</h1>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map(post => (
                <div key={post.id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow border border-gray-100">
                    <div className="h-48 bg-gray-200 overflow-hidden">
                       <img src={post.image} alt={post.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" onError={(e) => e.target.src = "https://via.placeholder.com/400x300?text=AICart+Blog"} /> 
                    </div>
                    <div className="p-6">
                        <div className="flex gap-4 text-xs font-semibold text-primary uppercase tracking-wider mb-2">
                            <span>{post.category}</span>
                            <span className="text-gray-400">{post.date}</span>
                        </div>
                        <h2 className="text-xl font-bold mb-3 text-gray-900 leading-tight">{post.title}</h2>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
                        <button className="text-primary font-medium hover:underline">Read More →</button>
                    </div>
                </div>
            ))}
        </div>
    </div>
  )
}

export default Blog
