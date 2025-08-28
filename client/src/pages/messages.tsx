import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient, QueryFunction } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Send } from "lucide-react";
import { format } from "date-fns";
import type { Message, User } from "@shared/schema";
import { useAuth } from "@/lib/auth";
import { BackButton } from "@/components/back-button";

interface Conversation {
  user: User;
  lastMessage: Message | null;
  unreadCount: number;
}

export default function MessagesPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const { user, isLoading } = useAuth();
  const search = window.location.search;
  const params = new URLSearchParams(search);
  const initialUserId = params.get("userId");
  const [activeTab, setActiveTab] = useState<'personal' | 'groups'>('personal');

  const { data: conversationsRaw = [], isLoading: conversationsLoading } = useQuery<Conversation[]>({
    queryKey: ["/api/conversations"],
  });
  const conversations = conversationsRaw.length > 0 ? conversationsRaw : [];

  const fetchMessages: QueryFunction<any[], any> = async ({ queryKey }) => {
    const userId = (queryKey as any[])[1] ?? null;
    if (!userId) return [];
    const res = await apiRequest("GET", `/api/messages/${userId}`);
    return res.json();
  };
  const { data: messagesRaw = [], isLoading: messagesLoading } = useQuery<any[], Error>({
    queryKey: ["/api/messages", selectedUserId],
    queryFn: fetchMessages,
    enabled: !!selectedUserId
  });
  const messages: any[] = Array.isArray(messagesRaw) ? messagesRaw : [];

  useEffect(() => {
    if (initialUserId) {
      setSelectedUserId(Number(initialUserId));
    }
  }, [initialUserId]);

  const sendMessageMutation = useMutation({
    mutationFn: async ({ receiverId, content }: { receiverId: number; content: string }) => {
      const response = await apiRequest("POST", "/api/messages", { receiverId, content });
      return response.json();
    },
    onSuccess: () => {
      setMessageInput("");
      queryClient.invalidateQueries({ queryKey: ["/api/messages", selectedUserId] });
      queryClient.invalidateQueries({ queryKey: ["/api/conversations"] });
    },
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedUserId) return;

    sendMessageMutation.mutate({
      receiverId: selectedUserId,
      content: messageInput.trim(),
    });
  };

  const selectedUser = conversations.find(c => c.user.id === selectedUserId)?.user;

  const userImages = [
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=60&h=60",
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=60&h=60",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=60&h=60",
  ];

  console.log({
    conversationsRaw,
    conversations,
    selectedUserId,
    selectedUser,
    messagesRaw,
    messages
  });

  if (conversationsLoading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
            <div className="lg:col-span-2 h-96 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="w-full flex justify-start mt-2 mb-4 px-4">
        <BackButton />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('personal')}
                  className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'personal'
                      ? 'bg-white text-travel-navy shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Personal
                </button>
                <button
                  onClick={() => setActiveTab('groups')}
                  className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                    activeTab === 'groups'
                      ? 'bg-white text-travel-navy shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  disabled
                >
                  Groups
                </button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {activeTab === 'personal' ? (
                conversations.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    <p>No conversations yet</p>
                    <p className="text-sm">Start a conversation and it will appear here!</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {conversations.map((conversation) => {
                      const userImage = userImages[conversation.user.id % userImages.length];
                      return (
                        <div
                          key={conversation.user.id}
                          className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors duration-300 ${
                            selectedUserId === conversation.user.id ? 'bg-blue-50 border-r-2 border-travel-primary' : ''
                          }`}
                          onClick={() => setSelectedUserId(conversation.user.id)}
                        >
                          <div className="flex items-center space-x-3">
                            <img 
                              src={userImage}
                              alt={conversation.user.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-travel-dark truncate">
                                {conversation.user.name}
                              </h4>
                              <p className="text-sm text-gray-600 truncate">
                                {conversation.lastMessage && ('content' in conversation.lastMessage ? conversation.lastMessage.content : "No messages yet")}
                              </p>
                            </div>
                            <div className="text-right">
                              {conversation.lastMessage &&
                                ('createdAt' in conversation.lastMessage && conversation.lastMessage.createdAt ? (
                                  <span className="text-xs text-gray-500">
                                    {format(new Date(conversation.lastMessage.createdAt), "MMM dd")}
                                  </span>
                                ) : (
                                  ""
                                ))}
                              {conversation.unreadCount > 0 && (
                                <Badge className="bg-travel-primary text-white mt-1">
                                  {conversation.unreadCount}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )
              ) : (
                <div className="p-4 text-center text-gray-400 select-none opacity-60">
                  <svg width="64" height="64" fill="none" viewBox="0 0 24 24" className="mx-auto mb-4"><path d="M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14l4-4h10a2 2 0 0 0 2-2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  <p className="text-lg font-medium mb-2">Group chat coming soon!</p>
                  <p className="text-sm">You'll be able to chat with groups here in a future update.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Chat Window */}
        <div className="lg:col-span-2">
          <Card className="h-96 flex flex-col">
            {selectedUser ? (
              <>
                {/* Chat Header */}
                <CardHeader className="border-b border-gray-200 flex-shrink-0">
                  <div className="flex items-center space-x-3">
                    <img 
                      src={userImages[selectedUser.id % userImages.length]}
                      alt={selectedUser.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-medium text-travel-dark">{selectedUser.name}</h4>
                      <p className="text-sm text-green-500">Online now</p>
                    </div>
                  </div>
                </CardHeader>

                {/* Chat Messages */}
                <CardContent className="flex-1 p-4 space-y-4 overflow-y-auto">
                  {messagesLoading ? (
                    <div className="animate-pulse space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                          <div className="bg-gray-200 rounded-2xl px-4 py-2 max-w-xs h-8"></div>
                        </div>
                      ))}
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      <p>No messages yet</p>
                      <p className="text-sm">Send a message to start the conversation!</p>
                    </div>
                  ) : (
                    messages.map((message) => {
                      const isCurrentUser = message.sender && message.sender.id === user?.id;
                      let createdAt: string | null = null;
                      if ('createdAt' in message && message.createdAt) {
                        createdAt = message.createdAt;
                      }
                      return (
                        <div key={message.id} className={`flex items-start space-x-3 ${isCurrentUser ? 'justify-end' : ''}`}>
                          {!isCurrentUser && (
                            <img 
                              src={userImages[message.sender.id % userImages.length]}
                              alt={message.sender.name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                          )}
                          <div className={`rounded-2xl px-4 py-2 max-w-xs ${
                            isCurrentUser 
                              ? 'bg-travel-primary text-white rounded-tr-sm' 
                              : 'bg-gray-100 rounded-tl-sm'
                          }`}>
                            <p className="text-sm">{'content' in message ? message.content : ''}</p>
                            {createdAt ? (
                              <span className={`text-xs ${isCurrentUser ? 'text-red-100' : 'text-gray-500'}`}>
                                {format(new Date(createdAt), "HH:mm")}
                              </span>
                            ) : null}
                          </div>
                        </div>
                      );
                    })
                  )}
                </CardContent>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200 flex-shrink-0">
                  <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
                    <Input
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 rounded-full"
                      disabled={sendMessageMutation.isPending}
                    />
                    <Button
                      type="submit"
                      size="icon"
                      disabled={!messageInput.trim() || sendMessageMutation.isPending}
                      className="rounded-full bg-travel-primary hover:bg-travel-mint transform-gpu transition-all duration-300 ease-in-out hover:shadow-lg hover:ring-2 hover:ring-travel-navy focus:ring-2 focus:ring-travel-navy"
                    >
                      <Send className="w-4 h-4 text-travel-navy" />
                    </Button>
                  </form>
                </div>
              </>
            ) : (
              <CardContent className="flex-1 flex items-center justify-center">
                <div className="text-center text-gray-400 select-none opacity-60">
                  <svg width="64" height="64" fill="none" viewBox="0 0 24 24" className="mx-auto mb-4"><path d="M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14l4-4h10a2 2 0 0 0 2-2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  <p className="text-lg font-medium mb-2">No messages yet</p>
                  <p className="text-sm">Start a conversation and it will appear here!</p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
