
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Button } from '../components/Button';
import { Blog as BlogType } from '../types';

export const Blog = () => {
  const { blogs } = useAppContext();
  const [selectedBlog, setSelectedBlog] = useState<BlogType | null>(null);

  const featured = blogs.find(b => b.featured) || blogs[0];
  const others = blogs.filter(b => b.id !== featured?.id);

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-900 transition-colors">
      
      {/* Hero */}
      <div className="bg-stone-900 py-24 text-center text-white relative overflow-hidden">
         <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1452421822248-d4c2b47f0c81?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-20"></div>
         <div className="absolute inset-0 bg-gradient-to-t from-stone-900 to-transparent"></div>
        <div className="relative z-10 px-4">
            <span className="inline-flex items-center gap-2 py-1 px-3 border border-white/20 rounded-full text-xs font-bold tracking-widest uppercase mb-4 text-emerald-300 bg-white/5 backdrop-blur-sm">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
                The Journal
            </span>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 font-display flex items-center justify-center gap-3">
                Stories & Guides
            </h1>
            <p className="text-lg text-stone-300 max-w-2xl mx-auto font-light">
              Inspiration for the modern explorer, curated by AI and human experts.
            </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-20 relative z-20">
        
        {/* Featured Article */}
        {featured && (
            <div 
                onClick={() => setSelectedBlog(featured)}
                className="group relative rounded-3xl overflow-hidden shadow-2xl cursor-pointer h-[500px] mb-12 border border-stone-200 dark:border-stone-700"
            >
                <img src={featured.image} alt={featured.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-stone-900/40 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full max-w-4xl">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                            Featured
                        </span>
                        <span className="text-stone-300 text-sm font-medium">{featured.readTime}</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 font-display leading-tight group-hover:text-emerald-300 transition-colors">{featured.title}</h2>
                    <p className="text-stone-200 text-lg line-clamp-2 md:w-2/3 mb-6">{featured.excerpt}</p>
                    <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-stone-700 flex items-center justify-center text-white font-bold text-sm">
                             {featured.author[0]}
                         </div>
                         <div className="text-sm">
                             <p className="text-white font-bold">{featured.author}</p>
                             <p className="text-stone-400">{featured.date}</p>
                         </div>
                    </div>
                </div>
            </div>
        )}

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {others.map(blog => (
            <div key={blog.id} className="group bg-white dark:bg-stone-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full border border-stone-100 dark:border-stone-700 hover:-translate-y-1">
              <div className="h-56 overflow-hidden relative">
                <img 
                  src={blog.image} 
                  alt={blog.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute top-4 left-4">
                     <span className="bg-white/90 backdrop-blur-sm text-stone-900 text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                         {blog.category}
                     </span>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">{blog.date}</span>
                    <span className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        {blog.readTime}
                    </span>
                </div>
                <h3 className="text-xl font-bold text-stone-900 dark:text-white mb-3 leading-tight group-hover:text-emerald-600 transition-colors">{blog.title}</h3>
                <p className="text-stone-600 dark:text-stone-400 text-sm mb-6 line-clamp-3 flex-grow leading-relaxed">
                  {blog.excerpt}
                </p>
                <div className="pt-4 border-t border-stone-100 dark:border-stone-700 flex items-center justify-between">
                     <span className="text-xs font-medium text-stone-500">By {blog.author}</span>
                    <button 
                    onClick={() => setSelectedBlog(blog)}
                    className="text-stone-900 dark:text-white font-bold text-sm hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center gap-1"
                    >
                    Read <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Blog Reading Modal */}
      {selectedBlog && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-sm" onClick={() => setSelectedBlog(null)}>
          <div 
            className="bg-white dark:bg-stone-800 rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto animate-fade-in-up" 
            onClick={e => e.stopPropagation()}
          >
             <div className="relative h-80">
               <img src={selectedBlog.image} className="w-full h-full object-cover" alt={selectedBlog.title} />
               <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-transparent opacity-80"></div>
               <button 
                 onClick={() => setSelectedBlog(null)} 
                 className="absolute top-6 right-6 bg-white/10 backdrop-blur text-white rounded-full p-2 hover:bg-white/20 transition-colors focus:outline-none z-10"
                 aria-label="Close modal"
               >
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                 </svg>
               </button>
               <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full">
                   <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-4 inline-block">{selectedBlog.category}</span>
                   <h2 className="text-3xl md:text-5xl font-bold text-white font-display mb-4 leading-tight">{selectedBlog.title}</h2>
                   <div className="flex items-center gap-4 text-stone-300 text-sm">
                        <div className="flex items-center gap-2">
                             <div className="w-6 h-6 rounded-full bg-stone-600 flex items-center justify-center text-xs font-bold">{selectedBlog.author[0]}</div>
                             {selectedBlog.author}
                        </div>
                        <span>•</span>
                        <span>{selectedBlog.date}</span>
                        <span>•</span>
                        <span>{selectedBlog.readTime}</span>
                   </div>
               </div>
             </div>
             
             <div className="p-8 md:p-12">
               <div className="prose prose-lg dark:prose-invert max-w-none text-stone-700 dark:text-stone-300 leading-relaxed font-serif">
                  <p className="text-xl md:text-2xl font-sans font-light leading-relaxed mb-10 text-stone-900 dark:text-stone-100 border-l-4 border-emerald-500 pl-6 italic">
                     {selectedBlog.excerpt}
                  </p>
                  {selectedBlog.content.split('\n').map((paragraph, idx) => (
                    <p key={idx} className="mb-6">{paragraph}</p>
                  ))}
                  <h3 className="text-2xl font-bold font-sans mt-8 mb-4">The Local Perspective</h3>
                  <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                  <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
               </div>
               
               <div className="mt-12 pt-8 border-t border-stone-100 dark:border-stone-700 flex justify-between items-center">
                 <div className="flex gap-4">
                    <button className="flex items-center gap-2 text-stone-500 hover:text-emerald-600 transition-colors text-sm font-medium">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                        Save
                    </button>
                    <button className="flex items-center gap-2 text-stone-500 hover:text-emerald-600 transition-colors text-sm font-medium">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                        Share
                    </button>
                 </div>
                 <Button variant="secondary" onClick={() => setSelectedBlog(null)}>Close Article</Button>
               </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};
