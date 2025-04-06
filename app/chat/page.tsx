"use client"

import React, { useState, useRef, useEffect } from 'react'
import { ChatMessage, generateMessageId, sendMessageToGemini } from '@/lib/gemini'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Send, Bot, User, LoaderCircle, HelpCircle, X } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { useAuth } from '@/lib/AuthContext'
import { useToast } from '@/components/ui/use-toast'
import { ChatInfo } from '@/components/chat-info'
import { Sheet, SheetContent } from '@/components/ui/sheet'

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const { user } = useAuth()
  const { toast } = useToast()

  // Initial greeting message
  useEffect(() => {
    if (messages.length === 0) {
      const initialMessage: ChatMessage = {
        id: generateMessageId(),
        role: 'model',
        content: "Hello! I'm your healthcare assistant. How can I help you today?",
        timestamp: new Date()
      }
      setMessages([initialMessage])
    }
  }, [messages.length])

  // Auto-scroll to the latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus the input field when the component loads
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate input
    if (!input.trim()) return
    
    const userMessage: ChatMessage = {
      id: generateMessageId(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    }
    
    // Update UI with user message
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    
    try {
      // Format history for Gemini API
      // Get all messages except the initial greeting
      // Start with the first user message and include all subsequent messages
      let relevantHistory = [...messages];
      
      // Find the index of the first user message
      const firstUserIndex = relevantHistory.findIndex(msg => msg.role === 'user');
      
      // If there's a user message in the history, include all messages from that point
      // Otherwise, we'll start fresh with just the current message
      const history = firstUserIndex >= 0 
        ? relevantHistory.slice(firstUserIndex).map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        : [];
      
      // Current user message is already in the messages array we copied from
      // No need to add it again to the history
      
      // Send message to Gemini
      const response = await sendMessageToGemini(userMessage.content, history)
      
      // Add AI response to chat
      const aiMessage: ChatMessage = {
        id: generateMessageId(),
        role: 'model',
        content: response,
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('Error getting response:', error)
      
      // Show error toast
      toast({
        title: 'Error',
        description: 'Failed to get a response. Please try again.',
        variant: 'destructive'
      })
      
      // Add error message
      const errorMessage: ChatMessage = {
        id: generateMessageId(),
        role: 'model',
        content: "I'm sorry, I encountered an error processing your request. Please try again.",
        timestamp: new Date()
      }
      
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      // Focus back on input
      inputRef.current?.focus()
    }
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="flex items-center gap-2 text-3xl font-bold">
          <Bot className="h-8 w-8 text-primary" />
          AI Health Assistant
        </h1>
        <p className="text-muted-foreground">Chat with our AI assistant about health topics and questions</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="h-[70vh] flex flex-col md:col-span-2">
          <CardHeader className="pb-4 flex flex-row justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-6 w-6 text-primary" />
              <span>Chat Session</span>
            </CardTitle>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => setShowInfo(true)}
              className="h-8 w-8 md:hidden"
            >
              <HelpCircle className="h-4 w-4" />
              <span className="sr-only">Help</span>
            </Button>
          </CardHeader>
          
          <CardContent className="flex-grow overflow-hidden p-0 pt-2">
            <ScrollArea className="h-full px-4">
              <div className="space-y-4 pb-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`flex max-w-[80%] items-start gap-3 rounded-lg p-4 ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      <div className="flex-shrink-0 pt-1">
                        {message.role === 'user' ? (
                          <User className="h-5 w-5" />
                        ) : (
                          <Bot className="h-5 w-5" />
                        )}
                      </div>
                      <div className="chat-bubble-content overflow-hidden">
                        {message.role === 'user' ? (
                          <div className="prose prose-sm">{message.content}</div>
                        ) : (
                          <div className="prose prose-sm max-w-full dark:prose-invert">
                            <ReactMarkdown>{message.content}</ReactMarkdown>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="flex max-w-[80%] items-start gap-3 rounded-lg bg-muted p-4">
                      <div className="flex-shrink-0 pt-1">
                        <Bot className="h-5 w-5" />
                      </div>
                      <div className="flex items-center gap-2">
                        <LoaderCircle className="h-5 w-5 animate-spin" />
                        <span>Thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
          </CardContent>
          
          <CardFooter className="border-t bg-background p-4">
            <form onSubmit={handleSendMessage} className="flex w-full gap-2">
              <Input
                ref={inputRef}
                placeholder="Type your health question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
                className="flex-grow"
              />
              <Button type="submit" disabled={isLoading || !input.trim()}>
                <Send className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
            </form>
          </CardFooter>
        </Card>
        
        {/* Info card for desktop */}
        <div className="hidden md:block">
          <ChatInfo />
        </div>
        
        {/* Mobile info sheet */}
        <Sheet open={showInfo} onOpenChange={setShowInfo}>
          <SheetContent className="overflow-y-auto">
            <div className="flex justify-end mb-4">
              <Button variant="ghost" size="icon" onClick={() => setShowInfo(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <ChatInfo onClose={() => setShowInfo(false)} />
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
}

