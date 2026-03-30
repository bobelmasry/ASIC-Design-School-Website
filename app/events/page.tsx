import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getPublishedEvents } from '@/lib/events-data'

export default function EventsPage() {
  const events = getPublishedEvents()

  return (
    <div className="container px-4 py-10 md:py-14">
      <div className="mb-8">
        <Badge variant="outline" className="mb-3">
          Public Events
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Events</h1>
        <p className="mt-3 max-w-3xl text-muted-foreground">
          Explore published event pages with agenda, sponsors, and FAQ.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {events.map((event) => (
          <Card key={event.slug} className="border-gray-300 dark:border-gray-800">
            <CardHeader>
              <CardTitle>{event.name}</CardTitle>
              <CardDescription>{event.summary}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <p>
                <span className="font-medium text-foreground">Dates:</span> {event.startsOn} to {event.endsOn}
              </p>
              <p>
                <span className="font-medium text-foreground">Location:</span> {event.location}
              </p>
              <Button asChild>
                <Link href={`/events/${event.slug}`}>View Event</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
