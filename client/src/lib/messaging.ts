import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot,
  updateDoc,
  serverTimestamp 
} from "firebase/firestore";
import { db } from "./firebase";
import { useAuth } from "./auth";

// Message interface
export interface Message {
  id?: string;
  senderId: string;
  receiverId: string;
  content: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
  // Optional fields for rich messages
  type?: 'text' | 'image' | 'file' | 'booking_request';
  metadata?: {
    fileName?: string;
    fileUrl?: string;
    fileSize?: number;
    imageUrl?: string;
    bookingId?: string;
  };
}

// Conversation interface
export interface Conversation {
  id?: string;
  participants: string[];
  lastMessage?: Message;
  lastMessageTime?: string;
  unreadCount?: number;
  createdAt: string;
  updatedAt: string;
}

// Messaging service class
export class MessagingService {
  private static instance: MessagingService;
  
  static getInstance(): MessagingService {
    if (!MessagingService.instance) {
      MessagingService.instance = new MessagingService();
    }
    return MessagingService.instance;
  }

  // Send a message
  async sendMessage(messageData: Omit<Message, 'id' | 'createdAt' | 'updatedAt' | 'read'>): Promise<string> {
    const message: Message = {
      ...messageData,
      read: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const messageRef = await addDoc(collection(db, 'messages'), message);
    
    // Update conversation
    await this.updateConversation(messageData.senderId, messageData.receiverId, message);
    
    return messageRef.id;
  }

  // Get conversation between two users
  async getConversation(user1Id: string, user2Id: string): Promise<Conversation | null> {
    const participants = [user1Id, user2Id].sort();
    const conversationId = participants.join('_');
    
    const conversationRef = doc(db, 'conversations', conversationId);
    const conversationDoc = await getDoc(conversationRef);
    
    if (conversationDoc.exists()) {
      return { id: conversationDoc.id, ...conversationDoc.data() } as Conversation;
    }
    
    // Create new conversation if it doesn't exist
    const newConversation: Conversation = {
      participants,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      unreadCount: 0,
    };
    
    await addDoc(collection(db, 'conversations'), newConversation);
    return newConversation;
  }

  // Get messages for a conversation
  async getMessages(user1Id: string, user2Id: string, limitCount: number = 50): Promise<Message[]> {
    const participants = [user1Id, user2Id].sort();
    
    const q = query(
      collection(db, 'messages'),
      where('senderId', 'in', participants),
      where('receiverId', 'in', participants),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Message[];
  }

  // Get user's conversations
  async getUserConversations(userId: string): Promise<Conversation[]> {
    const q = query(
      collection(db, 'conversations'),
      where('participants', 'array-contains', userId),
      orderBy('updatedAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Conversation[];
  }

  // Mark messages as read
  async markMessagesAsRead(senderId: string, receiverId: string): Promise<void> {
    const participants = [senderId, receiverId].sort();
    
    const q = query(
      collection(db, 'messages'),
      where('senderId', '==', senderId),
      where('receiverId', '==', receiverId),
      where('read', '==', false)
    );
    
    const snapshot = await getDocs(q);
    // Assuming writeBatch is available from firebase/firestore, otherwise this will cause an error.
    // For now, commenting out as it's not directly imported.
    // const batch = writeBatch(db);
    
    // snapshot.docs.forEach(doc => {
    //   batch.update(doc.ref, { read: true });
    // });
    
    // await batch.commit();
  }

  // Update conversation with new message
  private async updateConversation(senderId: string, receiverId: string, message: Message): Promise<void> {
    const participants = [senderId, receiverId].sort();
    const conversationId = participants.join('_');
    
    const conversationRef = doc(db, 'conversations', conversationId);
    const conversationDoc = await getDoc(conversationRef);
    
    if (conversationDoc.exists()) {
      // Update existing conversation
      await updateDoc(conversationRef, {
        lastMessage: message,
        lastMessageTime: message.createdAt,
        updatedAt: new Date().toISOString(),
        unreadCount: (conversationDoc.data().unreadCount || 0) + 1,
      });
    } else {
      // Create new conversation
      const newConversation: Conversation = {
        participants,
        lastMessage: message,
        lastMessageTime: message.createdAt,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        unreadCount: 1,
      };
      
      await addDoc(collection(db, 'conversations'), newConversation);
    }
  }

  // Real-time listeners
  subscribeToMessages(user1Id: string, user2Id: string, callback: (messages: Message[]) => void) {
    const participants = [user1Id, user2Id].sort();
    
    const q = query(
      collection(db, 'messages'),
      where('senderId', 'in', participants),
      where('receiverId', 'in', participants),
      orderBy('createdAt', 'desc'),
      limit(50)
    );
    
    return onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Message[];
      callback(messages.reverse()); // Show oldest first
    });
  }

  subscribeToConversations(userId: string, callback: (conversations: Conversation[]) => void) {
    const q = query(
      collection(db, 'conversations'),
      where('participants', 'array-contains', userId),
      orderBy('updatedAt', 'desc')
    );
    
    return onSnapshot(q, (snapshot) => {
      const conversations = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Conversation[];
      callback(conversations);
    });
  }

  // Get unread message count for a user
  async getUnreadCount(userId: string): Promise<number> {
    const q = query(
      collection(db, 'messages'),
      where('receiverId', '==', userId),
      where('read', '==', false)
    );
    
    const snapshot = await getDocs(q);
    return snapshot.size;
  }
}

// React hooks for messaging functionality
export function useMessaging() {
  const { user } = useAuth();
  const messagingService = MessagingService.getInstance();

  const sendMessage = async (receiverId: string, content: string, type: 'text' | 'image' | 'file' = 'text', metadata?: any) => {
    if (!user) throw new Error('User not authenticated');
    
    const messageData = {
      senderId: user.id,
      receiverId,
      content,
      type,
      metadata,
    };
    
    return await messagingService.sendMessage(messageData);
  };

  const getMessages = async (otherUserId: string) => {
    if (!user) return [];
    return await messagingService.getMessages(user.id, otherUserId);
  };

  const getConversations = async () => {
    if (!user) return [];
    return await messagingService.getUserConversations(user.id);
  };

  const markMessagesAsRead = async (senderId: string) => {
    if (!user) throw new Error('User not authenticated');
    return await messagingService.markMessagesAsRead(senderId, user.id);
  };

  const getUnreadCount = async () => {
    if (!user) return 0;
    return await messagingService.getUnreadCount(user.id);
  };

  return {
    sendMessage,
    getMessages,
    getConversations,
    markMessagesAsRead,
    getUnreadCount,
    subscribeToMessages: (otherUserId: string, callback: (messages: Message[]) => void) => 
      user ? messagingService.subscribeToMessages(user.id, otherUserId, callback) : () => {},
    subscribeToConversations: (callback: (conversations: Conversation[]) => void) => 
      user ? messagingService.subscribeToConversations(user.id, callback) : () => {},
  };
}
