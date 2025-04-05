import { MessageSquare } from "lucide-react"
import { ChatAssistant } from "@/components/chat-assistant"

export default function ChatPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">AI Health Assistant</h1>
        <p className="text-muted-foreground">Chat with our AI assistant for health information and guidance</p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <ChatAssistant />
        </div>

        <div>
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-sky-100 text-sky-700">
              <MessageSquare className="h-6 w-6" />
            </div>
            <h2 className="mb-2 text-xl font-semibold">How to Use the Chat</h2>
            <p className="mb-4 text-muted-foreground">
              Our AI health assistant can provide general health information and guidance. Here's how to get the most
              out of it:
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start">
                <span className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-sky-100 text-sky-700 text-xs">
                  1
                </span>
                <span>Ask specific questions about health topics</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-sky-100 text-sky-700 text-xs">
                  2
                </span>
                <span>Inquire about symptoms, medications, or conditions</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-sky-100 text-sky-700 text-xs">
                  3
                </span>
                <span>Get information about healthy lifestyle choices</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 flex h-5 w-5 items-center justify-center rounded-full bg-sky-100 text-sky-700 text-xs">
                  4
                </span>
                <span>Ask for guidance on when to seek medical attention</span>
              </li>
            </ul>

            <div className="mt-6 rounded-md bg-amber-50 p-4 text-amber-800">
              <p className="text-sm font-medium">Important Disclaimer</p>
              <p className="text-xs">
                This AI assistant provides general information only and is not a substitute for professional medical
                advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health
                provider with any questions you may have regarding a medical condition.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

