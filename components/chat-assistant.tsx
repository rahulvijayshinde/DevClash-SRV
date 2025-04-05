"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, Bot, Paperclip, Mic, X, Info } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Sample conversation data
const initialMessages = [
  {
    id: "1",
    role: "assistant",
    content: "Hello! I'm your AI health assistant. How can I help you today?",
    timestamp: new Date().toISOString(),
  },
]

export function ChatAssistant() {
  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = () => {
    if (input.trim() === "") return

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      let response = ""

      // Generate response based on user input
      const userInput = input.toLowerCase()

      if (userInput.includes("headache") || userInput.includes("head pain")) {
        response =
          "Headaches can have many causes, including stress, dehydration, lack of sleep, or eye strain. For occasional headaches, rest, hydration, and over-the-counter pain relievers may help. If you're experiencing severe, persistent, or unusual headaches, it's important to consult with a healthcare provider."
      } else if (userInput.includes("cold") || userInput.includes("flu") || userInput.includes("fever")) {
        response =
          "Common cold and flu symptoms can include fever, cough, sore throat, body aches, and fatigue. Rest, hydration, and over-the-counter medications can help manage symptoms. If you have a high fever, difficulty breathing, or symptoms that worsen or persist, please consult with a healthcare provider."
      } else if (userInput.includes("diet") || userInput.includes("nutrition") || userInput.includes("eat")) {
        response =
          "A balanced diet typically includes a variety of fruits, vegetables, whole grains, lean proteins, and healthy fats. It's recommended to limit processed foods, added sugars, and excessive sodium. Remember that individual nutritional needs can vary based on factors like age, activity level, and health conditions."
      } else if (userInput.includes("exercise") || userInput.includes("workout")) {
        response =
          "Regular physical activity is important for overall health. Adults should aim for at least 150 minutes of moderate-intensity exercise per week, along with muscle-strengthening activities twice a week. Always start gradually and consult with a healthcare provider before beginning a new exercise program, especially if you have existing health conditions."
      } else if (userInput.includes("sleep") || userInput.includes("insomnia")) {
        response =
          "Good sleep hygiene includes maintaining a consistent sleep schedule, creating a restful environment, limiting screen time before bed, and avoiding caffeine and large meals close to bedtime. Adults typically need 7-9 hours of sleep per night. If you're experiencing persistent sleep problems, consider consulting with a healthcare provider."
      } else if (userInput.includes("stress") || userInput.includes("anxiety")) {
        response =
          "Stress management techniques include deep breathing, meditation, physical activity, maintaining social connections, and ensuring adequate rest. If stress or anxiety is interfering with your daily life, consider speaking with a mental health professional who can provide appropriate support and treatment options."
      } else if (userInput.includes("blood pressure")) {
        response =
          "Normal blood pressure is typically around 120/80 mmHg. Lifestyle factors that can help maintain healthy blood pressure include regular exercise, a balanced diet low in sodium, limiting alcohol, not smoking, managing stress, and maintaining a healthy weight. Regular monitoring is important, especially if you have risk factors for hypertension."
      } else if (userInput.includes("diabetes")) {
        response =
          "Diabetes management typically involves monitoring blood glucose levels, taking prescribed medications, following a balanced diet, regular physical activity, and attending regular check-ups. It's important to work closely with healthcare providers to develop and adjust your diabetes management plan as needed."
      } else if (userInput.includes("appointment") || userInput.includes("doctor")) {
        response =
          "You can book a teleconsultation with one of our healthcare providers through the Consultations section of this app. This will allow you to speak with a medical professional who can provide personalized advice based on your specific health situation."
      } else {
        response =
          "Thank you for your question. I can provide general health information, but for personalized medical advice, it's best to consult with a healthcare provider. Is there a specific health topic you'd like to learn more about?"
      }

      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1500)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
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
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="AI Assistant" />
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                )}
                <div className="flex-1">
                  <div className="break-words text-sm">{message.content}</div>
                  <div className="mt-1 text-right text-xs opacity-70">
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
                {message.role === "user" && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="flex max-w-[80%] items-center gap-3 rounded-lg bg-muted p-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="AI Assistant" />
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
      <CardFooter className="border-t p-3">
        <div className="flex w-full items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="h-9 w-9 shrink-0">
                  <Paperclip className="h-4 w-4" />
                  <span className="sr-only">Attach file</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">Attach file</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="h-9 w-9 shrink-0">
                  <Mic className="h-4 w-4" />
                  <span className="sr-only">Voice input</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="top">Voice input</TooltipContent>
            </Tooltip>
          </TooltipProvider>

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
            disabled={!input.trim() || isLoading}
          >
            <Send className="h-4 w-4" />
            <span className="sr-only">Send message</span>
          </Button>
        </div>

        <div className="mt-2 flex items-center justify-center gap-1 text-xs text-muted-foreground">
          <Info className="h-3 w-3" />
          <span>For general information only. Not a substitute for professional medical advice.</span>
        </div>
      </CardFooter>
    </Card>
  )
}

