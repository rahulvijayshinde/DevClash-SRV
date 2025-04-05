import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

const testimonials = [
  {
    name: "Sarah Johnson",
    location: "Rural Montana",
    image: "/placeholder.svg?height=80&width=80",
    content:
      "MediConnect has been a lifesaver for our family. Living 50 miles from the nearest hospital, we can now get medical advice without the long drive.",
    initials: "SJ",
  },
  {
    name: "Miguel Rodriguez",
    location: "Remote Village, New Mexico",
    image: "/placeholder.svg?height=80&width=80",
    content:
      "The AI symptom checker helped identify my condition early. I was able to get treatment before it became serious. This platform is changing lives.",
    initials: "MR",
  },
  {
    name: "Aisha Patel",
    location: "Community Health Worker",
    image: "/placeholder.svg?height=80&width=80",
    content:
      "As a community health worker, I use MediConnect to connect my patients with specialists. The platform is intuitive and accessible even for those with limited tech experience.",
    initials: "AP",
  },
]

export function Testimonials() {
  return (
    <section className="mb-16">
      <div className="mb-12 text-center">
        <h2 className="mb-2 text-3xl font-bold">What Our Users Say</h2>
        <p className="mx-auto max-w-2xl text-muted-foreground">
          Real stories from people who have benefited from our telemedicine platform
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {testimonials.map((testimonial) => (
          <Card key={testimonial.name} className="border-none shadow-lg">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <Avatar className="h-12 w-12">
                <AvatarImage src={testimonial.image} alt={testimonial.name} />
                <AvatarFallback>{testimonial.initials}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{testimonial.name}</h3>
                <p className="text-sm text-muted-foreground">{testimonial.location}</p>
              </div>
            </CardHeader>
            <CardContent>
              <p className="italic text-muted-foreground">"{testimonial.content}"</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}

