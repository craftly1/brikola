
import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Inquiry {
  id: string;
  title: string;
  description: string;
  author: {
    name: string;
    avatar: string;
  };
  likes: number;
  comments: number;
  isLiked: boolean;
  timestamp: string;
  image?: string;
  category: 'general' | 'craftsmen';
  isMyPost: boolean;
}

export interface Comment {
  id: string;
  inquiryId: string;
  author: {
    name: string;
    avatar: string;
  };
  content: string;
  timestamp: string;
  replies: Comment[];
}

interface InquiryContextType {
  inquiries: Inquiry[];
  comments: Comment[];
  currentFilter: string;
  addInquiry: (inquiry: Omit<Inquiry, 'id' | 'timestamp' | 'likes' | 'comments' | 'isLiked'>) => void;
  toggleLike: (id: string) => void;
  addComment: (inquiryId: string, content: string) => void;
  setCurrentFilter: (filter: string) => void;
  getFilteredInquiries: () => Inquiry[];
}

const InquiryContext = createContext<InquiryContextType | undefined>(undefined);

export const useInquiry = () => {
  const context = useContext(InquiryContext);
  if (!context) {
    throw new Error('useInquiry must be used within an InquiryProvider');
  }
  return context;
};

export const InquiryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([
    {
      id: '1',
      title: 'أحتاج نجار ماهر لتصليح خزانة',
      description: 'السلام عليكم، أحتاج إلى نجار محترف لإصلاح خزانة خشبية في غرفة النوم. الخزانة بحاجة لتغيير المفاصل وإعادة ضبط الأبواب.',
      author: {
        name: 'أحمد محمد',
        avatar: '👨‍💼'
      },
      likes: 12,
      comments: 5,
      isLiked: false,
      timestamp: '2024-01-15T10:30:00Z',
      category: 'general',
      isMyPost: false
    },
    {
      id: '2',
      title: 'خدمات سباكة متاحة - خبرة 15 سنة',
      description: 'مرحباً، أنا سباك محترف بخبرة 15 سنة. أقدم خدمات الصيانة والإصلاح لجميع أعمال السباكة. متاح طوال الأسبوع.',
      author: {
        name: 'محمد السباك',
        avatar: '🔧'
      },
      likes: 25,
      comments: 8,
      isLiked: true,
      timestamp: '2024-01-14T15:45:00Z',
      category: 'craftsmen',
      isMyPost: false
    },
    {
      id: '3',
      title: 'مطلوب كهربائي لتركيب ثريا',
      description: 'أبحث عن كهربائي محترف لتركيب ثريا جديدة في صالة المنزل. العمل بسيط ولكن أحتاج خبرة للأمان.',
      author: {
        name: 'فاطمة أحمد',
        avatar: '👩‍💼'
      },
      likes: 8,
      comments: 3,
      isLiked: false,
      timestamp: '2024-01-13T09:20:00Z',
      category: 'general',
      isMyPost: true
    }
  ]);

  const [comments, setComments] = useState<Comment[]>([
    {
      id: '1',
      inquiryId: '1',
      author: {
        name: 'علي النجار',
        avatar: '🪚'
      },
      content: 'أستطيع مساعدتك في هذا العمل. لدي خبرة 10 سنوات في النجارة.',
      timestamp: '2024-01-15T11:00:00Z',
      replies: []
    }
  ]);

  const [currentFilter, setCurrentFilter] = useState('الأحدث');

  const addInquiry = (inquiry: Omit<Inquiry, 'id' | 'timestamp' | 'likes' | 'comments' | 'isLiked'>) => {
    const newInquiry: Inquiry = {
      ...inquiry,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      likes: 0,
      comments: 0,
      isLiked: false,
      isMyPost: true
    };
    setInquiries(prev => [newInquiry, ...prev]);
  };

  const toggleLike = (id: string) => {
    setInquiries(prev => prev.map(inquiry => 
      inquiry.id === id 
        ? { 
            ...inquiry, 
            isLiked: !inquiry.isLiked,
            likes: inquiry.isLiked ? inquiry.likes - 1 : inquiry.likes + 1
          }
        : inquiry
    ));
  };

  const addComment = (inquiryId: string, content: string) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      inquiryId,
      author: {
        name: 'أنت',
        avatar: '👤'
      },
      content,
      timestamp: new Date().toISOString(),
      replies: []
    };
    
    setComments(prev => [...prev, newComment]);
    setInquiries(prev => prev.map(inquiry => 
      inquiry.id === inquiryId 
        ? { ...inquiry, comments: inquiry.comments + 1 }
        : inquiry
    ));
  };

  const getFilteredInquiries = () => {
    let filtered = [...inquiries];
    
    switch (currentFilter) {
      case 'الأحدث':
        return filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      case 'الأكثر تفاعلاً':
        return filtered.sort((a, b) => (b.likes + b.comments) - (a.likes + a.comments));
      case 'الحرفيون فقط':
        return filtered.filter(inquiry => inquiry.category === 'craftsmen');
      case 'منشوراتي':
        return filtered.filter(inquiry => inquiry.isMyPost);
      default:
        return filtered;
    }
  };

  return (
    <InquiryContext.Provider value={{
      inquiries,
      comments,
      currentFilter,
      addInquiry,
      toggleLike,
      addComment,
      setCurrentFilter,
      getFilteredInquiries
    }}>
      {children}
    </InquiryContext.Provider>
  );
};
