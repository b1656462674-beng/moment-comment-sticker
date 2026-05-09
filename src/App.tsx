/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  ChevronLeft, 
  MoreHorizontal, 
  Smile, 
  Languages, 
  Mic, 
  PlusCircle, 
  Send,
  Heart,
  Cat,
  Zap,
  Globe,
  Layout,
  Ghost,
  MessageCircle,
  Glasses,
  ThumbsUp,
  Share2,
  Box
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---
interface Message {
  id: string;
  senderName: string;
  senderAvatar: string;
  senderFlag?: string;
  text?: string;
  stickers?: string[];
  timestamp: string;
  isReply?: boolean;
  likes: number;
}

// --- Mock Data ---
const EMOJIS = [
  '😊', '😡', '👎', '😭', '💩', '😁', '😂', '🤣', '😃', '😄', '😅', '😆', '😉', '😋', '😎', '😍', '😘', '🥰', '😗', '😙', '😚', '☺️', '🙂',
  '🤗', '🤩', '🤔', '🤨', '😐', '😑', '😶', '🙄', '😏', '😣', '😥', '😮', '🤐', '😯', '😪', '😫', '😴', '😌', '😛', '😜',
  '😝', '🤤', '😒', '😓', '😔', '😕', '🙃', '🤑', '😲', '☹️', '🙁', '😖', '😞', '😟', '😤', '😢', '😭', '😦', '😧', '😧', '😧',
];

const RECENT_EMOJIS = ['😊', '😡', '👎', '😭', '💩'];

const STICKER_PACKS = {
  cat: [
    'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=200&h=200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?q=80&w=200&h=200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1574158622682-e40e69881006?q=80&w=200&h=200&auto=format&fit=crop',
  ],
  hi: [
    'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?q=80&w=200&h=200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?q=80&w=200&h=200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1513245538231-15a456904f7f?q=80&w=200&h=200&auto=format&fit=crop',
  ]
};

const FAVORITES = [
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&h=200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1543852786-1cf6624b9987?q=80&w=200&h=200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?q=80&w=200&h=200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?q=80&w=200&h=200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=200&h=200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1513245538231-15a456904f7f?q=80&w=200&h=200&auto=format&fit=crop',
];

const HEARTS = [
  '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟'
];

// --- Components ---

const Header = () => (
  <header className="flex items-center justify-between px-4 py-3 bg-white sticky top-0 z-10" id="header">
    <div className="flex items-center gap-3">
      <button className="p-1 hover:bg-gray-100 rounded-full transition-colors" id="back-button">
        <ChevronLeft className="w-6 h-6 text-gray-700" />
      </button>
      <div className="flex items-center gap-2">
        <img 
          src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=60&h=60&auto=format&fit=crop" 
          className="w-8 h-8 rounded-full border border-gray-100 object-cover"
          alt="profile"
        />
        <h1 className="text-lg font-semibold text-gray-900" id="header-title">9qf</h1>
      </div>
    </div>
    <div className="flex items-center gap-4">
      <button className="p-1 hover:bg-gray-100 rounded-full transition-colors" id="more-button">
        <MoreHorizontal className="w-6 h-6 text-gray-500" />
      </button>
    </div>
  </header>
);

const PostContent = () => (
  <div className="border-b border-gray-100" id="post-content">
    {/* Simple Hero/Post Image Container */}
    <div className="px-4 py-2">
       <div className="h-[2px] bg-gray-900 rounded-full w-full opacity-10 mb-4" />
    </div>

    {/* Interaction Metrics from Image 5 */}
    <div className="px-4 py-3 flex items-center justify-between border-b border-gray-50 bg-white" id="metrics-bar">
      <div className="flex items-center gap-4 text-gray-500 text-sm">
        <button className="flex items-center gap-1.5 hover:text-purple-600 transition-colors">
          <ThumbsUp className="w-5 h-5" />
          <span>917</span>
        </button>
        <button className="flex items-center gap-1.5 hover:text-purple-600 transition-colors">
          <MessageCircle className="w-5 h-5" />
          <span>103</span>
        </button>
      </div>
      <div className="flex items-center gap-3">
        <button className="p-2 hover:bg-gray-50 rounded-full transition-colors">
          <Box className="w-5 h-5 text-gray-400" />
        </button>
        <button className="p-2 hover:bg-gray-50 rounded-full transition-colors">
          <Share2 className="w-5 h-5 text-gray-400" />
        </button>
      </div>
    </div>

    {/* Liked Users List from Image 5 */}
    <div className="px-4 py-4 flex items-center justify-between bg-white" id="liked-users">
      <div className="flex -space-x-2 overflow-hidden">
        {[
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=40&h=40&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=40&h=40&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=40&h=40&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=40&h=40&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=40&h=40&auto=format&fit=crop"
        ].map((url, i) => (
          <div key={i} className="relative">
            <img 
              src={url} 
              className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover" 
              alt="avatar" 
            />
            {i % 2 === 0 && <span className="absolute -bottom-1 -left-1 text-[10px]">🇨🇳</span>}
          </div>
        ))}
      </div>
      <button className="text-sm font-medium text-gray-800 flex items-center gap-1">
        917 Likes <ChevronLeft className="w-4 h-4 rotate-180" />
      </button>
    </div>
    
    <div className="h-2 bg-gray-50" />
    
    <div className="px-4 py-4 bg-white" id="comment-title">
      <h3 className="text-lg font-bold text-gray-900">评论(103)</h3>
    </div>
  </div>
);

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    { 
      id: '1', 
      senderName: 'Moir', 
      senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&h=100&auto=format&fit=crop',
      senderFlag: '🇨🇳',
      text: '谢谢大家的喜欢，我是作者的女朋友，平时视频照片都是我选的，很感谢大家感叹他，我们都是普通人这是我们在一起的第二年，这一路走来也很不容易，但我们很幸福相信你也会遇到自己喜欢的人，私信注意尺度，谢谢大家，如果你羡慕的话，你们也可以像我一样胡说八道', 
      timestamp: '星期二',
      likes: 9 
    },
    { 
      id: '2', 
      senderName: '尹小钦', 
      senderAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&h=100&auto=format&fit=crop',
      senderFlag: '🇨🇳',
      text: '哈哈哈', 
      timestamp: '星期二',
      isReply: true,
      likes: 0
    },
    { 
      id: '3', 
      senderName: '佳佳', 
      senderAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=100&h=100&auto=format&fit=crop',
      senderFlag: '🇨🇳',
      text: '😊', 
      timestamp: '星期四',
      isReply: true,
      likes: 0
    },
    { 
      id: '4', 
      senderName: 'Ph', 
      senderAvatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=100&h=100&auto=format&fit=crop',
      senderFlag: '🇨🇳',
      text: '点赞的好像都是中国👀', 
      timestamp: '星期二',
      likes: 2 
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [activeTab, setActiveTab] = useState<'system' | 'emoji' | 'heart' | 'hi' | 'cat' | 'glasses'>('emoji');
  const [selectedStickers, setSelectedStickers] = useState<string[]>([]);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim() && selectedStickers.length === 0) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      senderName: '我',
      senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&h=100&auto=format&fit=crop',
      text: inputValue || undefined,
      stickers: selectedStickers.length > 0 ? [...selectedStickers] : undefined,
      timestamp: '刚刚',
      likes: 0
    };

    setMessages([...messages, newMessage]);
    setInputValue('');
    setSelectedStickers([]);
    setShowPicker(false);
  };

  const addEmoji = (emoji: string) => {
    setInputValue(prev => prev + emoji);
  };

  const toggleSticker = (url: string) => {
    // Only allow one sticker - replace if another is picked
    setSelectedStickers([url]);
  };

  return (
    <div className="flex flex-col h-screen bg-white font-sans text-gray-900" id="app-container">
      <Header />
      
      <main className="flex-1 overflow-y-auto scroll-smooth pb-32" id="main-scroll" ref={scrollRef}>
        <PostContent />
        
        <div className="flex flex-col" id="message-list">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex gap-3 px-4 py-4 ${msg.isReply ? 'ml-12' : ''}`}
              id={`message-${msg.id}`}
            >
              <div className="flex-shrink-0 relative">
                <img 
                  src={msg.senderAvatar}
                  className="w-11 h-11 rounded-full object-cover border border-gray-100 shadow-sm"
                  alt="avatar"
                />
                {msg.senderFlag && (
                  <span className="absolute -bottom-1 -left-1 text-[12px]">{msg.senderFlag}</span>
                )}
              </div>
              <div className="flex-1 flex flex-col pt-0.5">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-gray-400">{msg.senderName}</span>
                </div>

                <div className="text-[15px] text-gray-800 leading-relaxed break-words pr-4">
                  {msg.text}
                </div>

                {msg.stickers && (
                  <div className="mt-2" id={`message-stickers-${msg.id}`}>
                    {msg.stickers.map((url, idx) => (
                      <img 
                        key={idx} 
                        src={url} 
                        alt="sticker" 
                        className="w-32 h-32 rounded-xl object-cover shadow-sm border border-gray-100"
                      />
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between mt-3 pr-2">
                  <div className="flex items-center gap-3">
                    <span className="text-[13px] text-gray-400">{msg.timestamp}</span>
                    {msg.id === '1' && (
                      <div className="flex items-center justify-center w-5 h-5 bg-purple-600 rounded-full text-white">
                        <Languages className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 text-gray-400 group">
                    <ThumbsUp className={`w-5 h-5 ${msg.likes > 0 ? 'text-gray-300' : 'text-gray-300'}`} />
                    {msg.likes > 0 && <span className="text-sm">{msg.likes}</span>}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Input Area */}
      <div className={`fixed bottom-0 left-0 right-0 bg-white border-t transition-all duration-300 z-20 ${showPicker ? 'h-[460px]' : 'h-auto'}`} id="input-container">
        <div className="p-3 flex flex-col gap-3">
          {/* Draft Preview (Supports Single Selection) */}
          <AnimatePresence>
            {selectedStickers.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="flex gap-2 py-2"
                id="sticker-preview"
              >
                <div className="relative group ml-2">
                  <img src={selectedStickers[0]} alt="preview" className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-xl ring-1 ring-gray-100" />
                  <button 
                    onClick={() => setSelectedStickers([])}
                    className="absolute -top-2 -right-2 bg-gray-900 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-lg"
                  >
                    ×
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center gap-4 px-1" id="input-bar">
            <div className="flex-1 bg-gray-100 rounded-full px-5 py-2.5 flex items-center" id="input-capsule">
              <input 
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="添加评论"
                className="flex-1 bg-transparent text-gray-800 placeholder-gray-400 outline-none text-[15px]"
                onFocus={() => setShowPicker(false)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              />
            </div>

            <div className="flex items-center gap-4 text-gray-700" id="input-actions">
              <button 
                onClick={() => setShowPicker(!showPicker)}
                className={`transition-all ${showPicker ? 'text-purple-600 scale-110' : 'active:scale-95'}`}
                id="emoji-btn"
              >
                <Smile className="w-7 h-7" />
              </button>
              <button className="active:scale-95 transition-transform" id="translate-btn">
                <Languages className="w-7 h-7" />
              </button>
              <button className="active:scale-95 transition-transform" id="ghost-btn">
                <Ghost className="w-7 h-7" />
              </button>
              {(inputValue || selectedStickers.length > 0) ? (
                <button 
                  onClick={handleSend}
                  className="p-1.5 bg-purple-600 text-white rounded-full shadow-lg"
                  id="send-btn"
                >
                  <Send className="w-5 h-5" />
                </button>
              ) : (
                <button className="active:scale-95 transition-transform" id="mic-btn">
                   <Mic className="w-7 h-7" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Picker with Tabs */}
        <AnimatePresence>
          {showPicker && (
            <motion.div 
              initial={{ height: 0 }}
              animate={{ height: 360 }}
              exit={{ height: 0 }}
              className="bg-white overflow-hidden flex flex-col"
              id="emoji-picker-container"
            >
              <div className="flex items-center px-4 py-3 gap-1 overflow-x-auto scrollbar-hide border-b border-gray-50" id="picker-tabs">
                <button 
                  onClick={() => setActiveTab('system')}
                  className={`p-2.5 rounded-2xl transition-all ${activeTab === 'system' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                >
                  <Layout className="w-6 h-6 text-gray-700" />
                </button>
                <div className="w-px h-6 bg-gray-100 mx-1" />
                <button 
                  onClick={() => setActiveTab('emoji')}
                  className={`p-2.5 rounded-2xl transition-all ${activeTab === 'emoji' ? 'bg-gray-100 scale-110' : 'hover:bg-gray-50'}`}
                >
                  <div className="text-2xl text-yellow-500">😊</div>
                </button>
                <button 
                  onClick={() => setActiveTab('heart')}
                  className={`p-2.5 rounded-2xl transition-all ${activeTab === 'heart' ? 'bg-gray-100 scale-110' : 'hover:bg-gray-50'}`}
                >
                  <div className="text-2xl text-red-500">❤️</div>
                </button>
                <button 
                  onClick={() => setActiveTab('hi')}
                  className={`p-2.5 rounded-2xl transition-all ${activeTab === 'hi' ? 'bg-gray-100 scale-110' : 'hover:bg-gray-50'}`}
                >
                  <div className="w-8 h-8 flex items-center justify-center bg-blue-400 rounded-full text-white font-bold text-[10px]">HI</div>
                </button>
                <button 
                  onClick={() => setActiveTab('cat')}
                  className={`p-2.5 rounded-2xl transition-all ${activeTab === 'cat' ? 'bg-gray-100 scale-110' : 'hover:bg-gray-50'}`}
                >
                  <img src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=40&h=40&auto=format&fit=crop" className="w-7 h-7 rounded-lg object-cover" alt="tab-cat" />
                </button>
                <button 
                  onClick={() => setActiveTab('glasses')}
                  className={`p-2.5 rounded-2xl transition-all ${activeTab === 'glasses' ? 'bg-gray-100 scale-110' : 'hover:bg-gray-50'}`}
                >
                  <div className="text-2xl">😎</div>
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 pb-8 custom-scrollbar bg-[#fdfdfd]" id="picker-content">
                {(activeTab === 'emoji' || activeTab === 'system') && (
                  <div className="flex flex-col gap-8">
                    <section>
                      <h4 className="text-[12px] font-bold text-gray-300 uppercase tracking-widest mb-4 ml-1">最近使用</h4>
                      <div className="grid grid-cols-5 gap-y-6 gap-x-2">
                        {RECENT_EMOJIS.map((emoji, i) => (
                          <button key={i} onClick={() => addEmoji(emoji)} className="text-4xl active:scale-125 transition-transform">{emoji}</button>
                        ))}
                      </div>
                    </section>
                    <section>
                      <h4 className="text-[12px] font-bold text-gray-300 uppercase tracking-widest mb-4 ml-1">热门心形</h4>
                      <div className="grid grid-cols-7 gap-y-6 gap-x-2">
                        {HEARTS.slice(0, 14).map((heart, i) => (
                          <button key={i} onClick={() => addEmoji(heart)} className="text-3xl active:scale-125 transition-transform">{heart}</button>
                        ))}
                      </div>
                    </section>
                    <section>
                      <h4 className="text-[12px] font-bold text-gray-300 uppercase tracking-widest mb-4 ml-1">所有表情</h4>
                      <div className="grid grid-cols-7 gap-y-6 gap-x-2">
                        {EMOJIS.map((emoji, i) => (
                          <button key={i} onClick={() => addEmoji(emoji)} className="text-3xl active:scale-125 transition-transform">{emoji}</button>
                        ))}
                      </div>
                    </section>
                  </div>
                )}

                {(activeTab === 'heart' || activeTab === 'cat' || activeTab === 'hi' || activeTab === 'glasses') && (
                  <div className="flex flex-col gap-6">
                    <h4 className="text-[12px] font-bold text-gray-300 uppercase tracking-widest ml-1">
                      {activeTab === 'heart' ? '我的收藏' : '丰富贴图'}
                    </h4>
                    <div className="grid grid-cols-3 gap-3 py-2">
                      {(activeTab === 'heart' ? FAVORITES : [...STICKER_PACKS.cat, ...STICKER_PACKS.hi]).map((url, i) => (
                        <button 
                          key={i} 
                          onClick={() => toggleSticker(url)}
                          className={`relative rounded-2xl overflow-hidden aspect-square border-2 transition-all ${selectedStickers.includes(url) ? 'border-purple-500 scale-95 ring-4 ring-purple-100' : 'border-transparent hover:border-gray-100'}`}
                        >
                          <img 
                            src={url} 
                            alt="sticker-thumb" 
                            className="w-full h-full object-cover rounded-xl"
                          />
                          {selectedStickers.includes(url) && (
                            <div className="absolute inset-0 bg-purple-600/10 flex items-center justify-center">
                              <div className="bg-purple-600 text-white rounded-full p-1 shadow-lg">
                                <Send className="w-4 h-4" />
                              </div>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="h-1 w-12 bg-gray-200 mx-auto rounded-full my-2 flex-shrink-0" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #eee; border-radius: 10px; }
      `}</style>
    </div>
  );
}

