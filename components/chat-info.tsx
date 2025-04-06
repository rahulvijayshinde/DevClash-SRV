"use client"

import { MessageSquare, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function ChatInfo({ onClose }: { onClose?: () => void }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          <span>About the AI Health Assistant</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>
          Our AI health assistant is powered by Google's Gemini AI and can provide general health information and guidance.
        </p>
        
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>How to use the chat</AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary text-xs">1</span>
                  <span>Ask specific questions about health topics</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary text-xs">2</span>
                  <span>Inquire about symptoms, medications, or conditions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary text-xs">3</span>
                  <span>Get information about healthy lifestyle choices</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary text-xs">4</span>
                  <span>Ask for guidance on when to seek medical attention</span>
                </li>
              </ul>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-2">
            <AccordionTrigger>Example questions you can ask</AccordionTrigger>
            <AccordionContent>
              <ul className="space-y-2 text-sm">
                <li>"What are common symptoms of diabetes?"</li>
                <li>"How can I improve my sleep quality?"</li>
                <li>"What foods are good for heart health?"</li>
                <li>"When should I see a doctor about a headache?"</li>
                <li>"What are the side effects of ibuprofen?"</li>
              </ul>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        <div className="rounded-md bg-amber-50 p-4 text-amber-800 flex gap-2 items-start">
          <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Important Disclaimer</p>
            <p className="text-sm mt-1">
              This AI assistant provides general information only and is not a substitute for professional medical
              advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health
              provider with any questions you may have regarding a medical condition.
            </p>
          </div>
        </div>
        
        {onClose && (
          <Button onClick={onClose} className="w-full">
            Close
          </Button>
        )}
      </CardContent>
    </Card>
  )
} 