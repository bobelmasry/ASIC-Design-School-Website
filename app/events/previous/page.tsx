import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function PreviousEventsPage() {
  return (
    <div className="container px-4 py-10 md:py-14">
      <Card className="mx-auto max-w-3xl border-dashed border-gray-400/60 dark:border-gray-700">
        <CardHeader>
          <Badge variant="outline" className="w-fit">
            Placeholder
          </Badge>
          <CardTitle>Previous Events</CardTitle>
          <CardDescription>
            The previous events archive is intentionally inactive for v1.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Past-event content and archive browsing will be enabled in a later release.
        </CardContent>
      </Card>
    </div>
  )
}
