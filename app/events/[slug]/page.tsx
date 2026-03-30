import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getEventBySlug, getPublishedEvents } from '@/lib/events-data'

type EventPageProps = {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  return getPublishedEvents().map((event) => ({ slug: event.slug }))
}

export default async function EventDetailsPage({ params }: EventPageProps) {
  const { slug } = await params
  const event = getEventBySlug(slug)

  if (!event) {
    notFound()
  }

  const sortedAgenda = [...event.agenda].sort((a, b) => a.startsAt.localeCompare(b.startsAt))

  return (
    <div className="container px-4 py-10 md:py-14">
      <div className="mb-8 space-y-3">
        <Badge variant="outline">Public Event Page</Badge>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{event.name}</h1>
        <p className="max-w-3xl text-muted-foreground">{event.summary}</p>
        <p className="text-sm text-muted-foreground">
          {event.startsOn} to {event.endsOn} | {event.location}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-gray-300 dark:border-gray-800 lg:col-span-2">
          <CardHeader>
            <CardTitle>Agenda / Schedule</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {sortedAgenda.map((item) => (
              <div key={`${item.title}-${item.startsAt}`} className="rounded-md border p-4">
                <p className="text-xs text-muted-foreground">{item.startsAt} | {item.duration}</p>
                <p className="mt-1 font-medium">{item.title}</p>
                {item.speakerName ? (
                  <p className="text-sm text-muted-foreground">Speaker: {item.speakerName}</p>
                ) : null}
                <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-gray-300 dark:border-gray-800">
          <CardHeader>
            <CardTitle>Sponsors</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {event.sponsors.map((sponsor) => (
              <div key={sponsor.name} className="rounded-md border p-3">
                <p className="font-medium">{sponsor.name}</p>
                {sponsor.website ? (
                  <a
                    href={sponsor.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    Visit sponsor
                  </a>
                ) : (
                  <p className="text-sm text-muted-foreground">Logo and profile update coming soon.</p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6 border-gray-300 dark:border-gray-800">
        <CardHeader>
          <CardTitle>FAQ</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible>
            {event.faq.map((item) => (
              <AccordionItem key={item.question} value={item.question}>
                <AccordionTrigger>{item.question}</AccordionTrigger>
                <AccordionContent>{item.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      <Card className="mt-6 border-dashed border-gray-400/60 dark:border-gray-700">
        <CardHeader>
          <CardTitle>Registration</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Application form is intentionally deferred in the current implementation.
          </p>
          <Button asChild variant="outline">
            <Link href="/events">Back to events</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
