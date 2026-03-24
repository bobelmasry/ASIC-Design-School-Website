"use client"

import * as React from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Loader2 } from "lucide-react"
import { resolveAttachmentUrls, type Attachment } from "@/lib/attachments"

type AttachmentsGridProps = {
  attachments?: Attachment[] | null
}

const TEXT_PREVIEW_LIMIT = 1000
const TEXT_LIKE_MIME = ["application/json", "application/javascript", "application/x-javascript"]
const TEXT_LIKE_EXTENSIONS = [".ts", ".tsx", ".js", ".jsx", ".json", ".md", ".txt", ".py", ".sh", ".html", ".css"]

export function AttachmentsGrid({ attachments }: AttachmentsGridProps) {
  const [resolved, setResolved] = React.useState<Attachment[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    let isMounted = true
    setError(null)

    const load = async () => {
      if (!attachments?.length) {
        setResolved([])
        return
      }

      setIsLoading(true)
      try {
        const withUrls = await resolveAttachmentUrls(attachments)
        if (!isMounted) return
        setResolved(withUrls)
      } catch (err) {
        if (!isMounted) return
        setError(err instanceof Error ? err.message : "Unable to load attachments.")
        setResolved([])
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    load()
    return () => {
      isMounted = false
    }
  }, [attachments])

  if (!attachments?.length) return null

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Loading attachments...
      </div>
    )
  }

  if (error) {
    return <p className="text-sm text-destructive">{error}</p>
  }

  if (!resolved.length) return null

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">Attachments</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {resolved.map((attachment) => (
          <Card key={attachment.id || attachment.path} className="border-gray-300 dark:border-gray-800">
            <CardContent className="p-3 space-y-2">
              {attachment.type?.startsWith("image/") && attachment.url ? (
                <div className="relative w-full h-40 overflow-hidden rounded-md">
                  <Image
                    src={attachment.url}
                    alt={attachment.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    unoptimized
                  />
                </div>
              ) : isTextLikeAttachment(attachment) && attachment.url ? (
                <TextAttachmentPreview attachment={attachment} />
              ) : (
                <div className="p-3 text-xs font-mono bg-muted rounded-md overflow-x-auto">
                  <p>{attachment.name}</p>
                  <p className="text-muted-foreground">{attachment.type || "File"}</p>
                </div>
              )}
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="truncate" title={attachment.name}>
                  {attachment.name}
                </span>
                <span>{formatBytes(attachment.size)}</span>
              </div>
              {attachment.url && (
                <Button asChild size="sm" variant="outline" className="w-full dark:hover:text-white dark:hover:bg-gray-800">
                  <a href={attachment.url} target="_blank" rel="noreferrer" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Download
                  </a>
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

const formatBytes = (bytes: number) => {
  if (!bytes) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

const isTextLikeAttachment = (attachment: Attachment) => {
  const type = attachment.type?.toLowerCase() || ""
  if (type.startsWith("text/")) return true
  if (TEXT_LIKE_MIME.includes(type)) return true

  const name = attachment.name?.toLowerCase() || ""
  return TEXT_LIKE_EXTENSIONS.some((ext) => name.endsWith(ext))
}

type TextAttachmentPreviewProps = {
  attachment: Attachment
}

const TextAttachmentPreview = ({ attachment }: TextAttachmentPreviewProps) => {
  const [content, setContent] = React.useState<string | null>(null)
  const [error, setError] = React.useState<string | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)

  React.useEffect(() => {
    if (!attachment.url) return

    const controller = new AbortController()
    const load = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch(attachment.url as string, {
          signal: controller.signal,
          headers: { Range: `bytes=0-${TEXT_PREVIEW_LIMIT * 2}` },
        })
        if (!response.ok) {
          throw new Error("Unable to load preview.")
        }
        const text = await response.text()
        setContent(text.slice(0, TEXT_PREVIEW_LIMIT))
      } catch (err) {
        if ((err as DOMException).name === "AbortError") return
        setError(err instanceof Error ? err.message : "Unable to load preview.")
      } finally {
        setIsLoading(false)
      }
    }

    load()
    return () => controller.abort()
  }, [attachment.url])

  if (isLoading) {
    return (
      <div className="p-3 text-xs font-mono bg-muted rounded-md">
        <Loader2 className="h-3 w-3 mr-2 inline animate-spin" />
        Loading preview...
      </div>
    )
  }

  if (error || !content) {
    return (
      <div className="p-3 text-xs font-mono bg-muted rounded-md">
        <p>{attachment.name}</p>
        <p className="text-muted-foreground">{error || attachment.type || "File"}</p>
      </div>
    )
  }

  return (
    <pre className="p-3 text-xs bg-muted rounded-md overflow-x-auto max-h-48 whitespace-pre-wrap">
      {content}
      {content.length >= TEXT_PREVIEW_LIMIT && "\n…"}
    </pre>
  )
}
