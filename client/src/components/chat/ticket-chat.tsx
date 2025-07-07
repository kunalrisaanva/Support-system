import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Send, Bot, Sparkles } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface ChatMessage {
  id: number;
  ticketId: number;
  senderId: number | null;
  senderName: string;
  senderType: "agent" | "customer";
  message: string;
  isAiSuggestion: boolean;
  createdAt: string;
}

interface Ticket {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  customerName: string;
  customerEmail: string;
  customerAvatar: string | null;
  assignedTo: string | null;
  createdAt: string;
  updatedAt: string;
}

interface TicketChatProps {
  ticketId: number;
  onClose: () => void;
}

export function TicketChat({ ticketId, onClose }: TicketChatProps) {
  const [message, setMessage] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch ticket details
  const { data: ticket, isLoading: ticketLoading } = useQuery({
    queryKey: ["/api/tickets", ticketId],
    queryFn: async () => {
      const response = await apiRequest(`/api/tickets/${ticketId}`);
      return response.json() as Promise<Ticket>;
    },
  });

  // Fetch chat messages
  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ["/api/tickets", ticketId, "messages"],
    queryFn: async () => {
      const response = await apiRequest(`/api/tickets/${ticketId}/messages`);
      return response.json() as Promise<ChatMessage[]>;
    },
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (messageData: { message: string }) => {
      const response = await apiRequest(`/api/tickets/${ticketId}/messages`, {
        method: "POST",
        body: JSON.stringify({
          senderId: 1, // Current user ID
          senderName: "Sarah Johnson",
          senderType: "agent",
          message: messageData.message,
          isAiSuggestion: false,
        }),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tickets", ticketId, "messages"] });
      setMessage("");
      setShowSuggestions(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Get AI suggestions mutation
  const getSuggestionsMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest(`/api/tickets/${ticketId}/suggestions`, {
        method: "POST",
      });
      return response.json() as Promise<{ suggestions: string[] }>;
    },
    onSuccess: (data) => {
      setSuggestions(data.suggestions);
      setShowSuggestions(true);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to get AI suggestions. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    sendMessageMutation.mutate({ message: message.trim() });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleUseSuggestion = (suggestion: string) => {
    setMessage(suggestion);
    setShowSuggestions(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "bg-red-500";
      case "high": return "bg-orange-500";
      case "medium": return "bg-yellow-500";
      case "low": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "bg-blue-500";
      case "in-progress": return "bg-purple-500";
      case "resolved": return "bg-green-500";
      case "closed": return "bg-gray-500";
      default: return "bg-gray-500";
    }
  };

  if (ticketLoading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-6">
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!ticket) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="p-6">
          <div className="text-center">
            <p className="text-gray-500">Ticket not found</p>
            <Button onClick={onClose} className="mt-4">
              Go Back
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="w-10 h-10">
              <AvatarImage src={ticket.customerAvatar || undefined} />
              <AvatarFallback>
                {ticket.customerName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xl">{ticket.title}</CardTitle>
              <p className="text-sm text-gray-500">{ticket.customerName} • {ticket.customerEmail}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={`${getPriorityColor(ticket.priority)} text-white`}>
              {ticket.priority}
            </Badge>
            <Badge className={`${getStatusColor(ticket.status)} text-white`}>
              {ticket.status}
            </Badge>
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
        <Separator />
      </CardHeader>

      <CardContent className="p-0">
        <div className="flex flex-col h-[600px]">
          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messagesLoading ? (
                <div className="flex items-center justify-center h-20">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.senderType === "agent" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg px-4 py-2 ${
                        msg.senderType === "agent"
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm">{msg.senderName}</span>
                        <span className="text-xs opacity-70">
                          {format(new Date(msg.createdAt), "h:mm a")}
                        </span>
                      </div>
                      <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* AI Suggestions */}
          {showSuggestions && (
            <div className="border-t p-4 bg-gray-50 dark:bg-gray-900">
              <div className="flex items-center gap-2 mb-3">
                <Bot className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium">AI Suggestions</span>
              </div>
              <div className="space-y-2">
                {suggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="w-full text-left justify-start h-auto py-2 px-3"
                    onClick={() => handleUseSuggestion(suggestion)}
                  >
                    <span className="text-sm whitespace-normal text-left">{suggestion}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Message Input */}
          <div className="border-t p-4">
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="min-h-[40px] max-h-[120px]"
                  rows={1}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => getSuggestionsMutation.mutate()}
                  disabled={getSuggestionsMutation.isPending}
                >
                  <Sparkles className="w-4 h-4" />
                </Button>
                <Button
                  onClick={handleSendMessage}
                  disabled={!message.trim() || sendMessageMutation.isPending}
                  size="sm"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}