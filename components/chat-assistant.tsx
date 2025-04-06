"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Send, Bot, Paperclip, Mic, X, Info, FileText, Image as ImageIcon, File } from "lucide-react"
import { sendMessageToGemini } from "@/lib/gemini"
import { Button } from "@/components/ui/button"
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface AttachmentType {
  type: "image" | "pdf" | "document" | "file";
  name: string;
  url: string;
  size?: string;
  file: File;
}

interface MessageType {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  attachments?: AttachmentType[];
}

const initialMessages: MessageType[] = [
  {
    id: "1",
    role: "assistant",
    content: "Hello! I'm your AI health assistant. How can I help you today?",
    timestamp: new Date().toISOString(),
  },
]

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function ChatAssistant() {
  const [messages, setMessages] = useState<MessageType[]>(initialMessages)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [attachments, setAttachments] = useState<AttachmentType[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  const handleSendMessage = async () => {
    const trimmedInput = input.trim()
    if ((!trimmedInput && attachments.length === 0) || isLoading) return

    const userMessage: MessageType = {
      id: Date.now().toString(),
      role: "user",
      content: trimmedInput || (attachments.length > 0 ? `Sent ${attachments.length} attachment(s)` : ""),
      timestamp: new Date().toISOString(),
      attachments: attachments.length > 0 ? [...attachments] : undefined
    }

    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    
    const currentAttachments = [...attachments]
    setAttachments([])

    try {
      const chatHistory = messages
        .filter(msg => msg.id !== "1")
        .map(({ role, content }) => ({ role, content }))
      
      const responseText = await sendMessageToGemini(
        trimmedInput, 
        chatHistory, 
        currentAttachments.length > 0 ? currentAttachments[0].file : undefined
      )
      
      const assistantMessage: MessageType = {
        id: Date.now().toString(),
        role: "assistant",
        content: responseText,
        timestamp: new Date().toISOString(),
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error("Chat error:", error)
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: "assistant",
        content: "I'm having trouble processing your request. Please try again with a different file or text query.",
        timestamp: new Date().toISOString(),
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleFileSelected = (file: File) => {
    if (!file) return
    
    if (file.size > MAX_FILE_SIZE) {
      alert(`File is too large. Maximum size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.`)
      return
    }
    
    const url = URL.createObjectURL(file)
    const formatFileSize = (bytes: number): string => {
      if (bytes < 1024) return bytes + ' B'
      if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
      return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
    }
    
    const newAttachment = {
      type: file.type.startsWith('image/') ? "image" : 
            file.type === 'application/pdf' ? "pdf" : 
            file.type.includes('document') ? "document" : "file",
      name: file.name,
      url: url,
      size: formatFileSize(file.size),
      file: file
    }
    
    setAttachments(prev => [...prev, newAttachment as AttachmentType])
  }

  const clearAttachment = (url: string) => {
    URL.revokeObjectURL(url)
    setAttachments(prev => prev.filter(a => a.url !== url))
  }

  const clearAllAttachments = () => {
    attachments.forEach(a => URL.revokeObjectURL(a.url))
    setAttachments([])
  }

  return (
    <Card className="flex h-[600px] flex-col">
      <CardHeader className="border-b px-4 py-3">
        <CardTitle className="flex items-center text-lg">
          <Bot className="mr-2 h-5 w-5 text-primary" />
          AI Health Assistant
        </CardTitle>
      </CardHeader>
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`flex max-w-[80%] items-start gap-3 rounded-lg p-3 ${
                  message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}
              >
                {message.role === "assistant" && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/ai-avatar.png" alt="AI Assistant" />
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                )}
                <div className="flex-1">
                  <div className="break-words text-sm">{message.content}</div>
                  
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {message.attachments.map((attachment) => (
                        <div key={attachment.url} className="overflow-hidden rounded-md border border-border">
                          {attachment.type === "image" ? (
                            <img 
                              src={attachment.url} 
                              alt={attachment.name}
                              className="max-h-[120px] max-w-[120px] object-cover"
                            />
                          ) : (
                            <div className="flex items-center gap-2 p-2 text-xs hover:bg-muted/80 max-w-[160px]">
                              {attachment.type === "pdf" ? (
                                <FileText className="h-4 w-4 shrink-0" />
                              ) : (
                                <File className="h-4 w-4 shrink-0" />
                              )}
                              <span className="truncate">{attachment.name}</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="mt-1 text-right text-xs opacity-70">
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
                {message.role === "user" && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/user-avatar.png" alt="User" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="flex max-w-[80%] items-center gap-3 rounded-lg bg-muted p-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/ai-avatar.png" alt="AI Assistant" />
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
                <div className="flex items-center gap-1">
                  <div className="h-2 w-2 animate-bounce rounded-full bg-primary"></div>
                  <div
                    className="h-2 w-2 animate-bounce rounded-full bg-primary"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="h-2 w-2 animate-bounce rounded-full bg-primary"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {attachments.length > 0 && (
        <div className="mx-3 mb-2 rounded-md border border-border bg-muted/50 p-2">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium">Attachments ({attachments.length})</div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 p-1" 
              onClick={clearAllAttachments}
            >
              Clear all
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {attachments.map((attachment) => (
              <div 
                key={attachment.url} 
                className="flex items-center gap-2 bg-background rounded p-1 max-w-[200px]"
              >
                {attachment.type === "image" ? (
                  <ImageIcon className="h-4 w-4 text-primary" />
                ) : attachment.type === "pdf" ? (
                  <FileText className="h-4 w-4 text-primary" />
                ) : (
                  <File className="h-4 w-4 text-primary" />
                )}
                <span className="truncate text-xs">{attachment.name}</span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-5 w-5 p-0 ml-auto" 
                  onClick={() => clearAttachment(attachment.url)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      <CardFooter className="border-t p-3">
        <div className="flex w-full flex-col gap-2">
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="h-9 w-9 shrink-0"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                  >
                    <Paperclip className="h-4 w-4" />
                    <span className="sr-only">Attach file</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="top">Attach file</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <input 
              type="file" 
              ref={fileInputRef}
              style={{ display: 'none' }} 
              accept="image/*,.pdf,.doc,.docx,.txt"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleFileSelected(e.target.files[0])
                  e.target.value = ''
                }
              }}
            />

            <div className="relative flex-1">
              <Input
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="pr-10"
                disabled={isLoading}
              />
              {input && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full w-10 rounded-l-none"
                  onClick={() => setInput("")}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Clear input</span>
                </Button>
              )}
            </div>

            <Button
              size="icon"
              className="h-9 w-9 shrink-0"
              onClick={handleSendMessage}
              disabled={(!input.trim() && attachments.length === 0) || isLoading}
            >
              <Send className="h-4 w-4" />
              <span className="sr-only">Send message</span>
            </Button>
          </div>

          <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
            <Info className="h-3 w-3" />
            <span>For general information only. Not a substitute for professional medical advice.</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}