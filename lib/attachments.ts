"use client"

import { supabase } from "@/lib/supabase"

export type Attachment = {
  id: string
  name: string
  type: string
  size: number
  path?: string | null
  url?: string | null
}

export type AttachmentWithUrl = Attachment & { url: string }

export const ATTACHMENTS_BUCKET = "forum-attachments"
export const MAX_ATTACHMENT_COUNT = 5
export const MAX_ATTACHMENT_SIZE_MB = 25
export const SIGNED_URL_TTL_SECONDS = 60 * 60

const BYTES_PER_MB = 1024 * 1024

const generateFilePath = (fileName: string, userId?: string | null) => {
  const extension = fileName.includes(".") ? fileName.substring(fileName.lastIndexOf(".")) : ""
  const uuid =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `${Math.random().toString(36).slice(2)}${Date.now()}`

  return `${userId || "anonymous"}/${uuid}${extension}`
}

export const validateAttachmentSelection = (files: File[]): string | null => {
  if (!files.length) return null

  if (files.length > MAX_ATTACHMENT_COUNT) {
    return `You can upload up to ${MAX_ATTACHMENT_COUNT} attachments at a time.`
  }

  for (const file of files) {
    if (file.size > MAX_ATTACHMENT_SIZE_MB * BYTES_PER_MB) {
      return `${file.name} exceeds the ${MAX_ATTACHMENT_SIZE_MB}MB limit.`
    }
  }

  return null
}

export async function uploadAttachment(file: File, userId?: string | null): Promise<Attachment> {
  const validationError = validateAttachmentSelection([file])
  if (validationError) {
    throw new Error(validationError)
  }

  const filePath = generateFilePath(file.name, userId)
  const { error } = await supabase.storage.from(ATTACHMENTS_BUCKET).upload(filePath, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type,
  })

  if (error) {
    throw new Error(error.message || "Unable to upload attachment.")
  }

  return {
    id: filePath,
    path: filePath,
    name: file.name,
    type: file.type || "application/octet-stream",
    size: file.size,
  }
}

export async function uploadAttachments(files: File[], userId?: string | null): Promise<Attachment[]> {
  if (!files.length) return []

  const validationError = validateAttachmentSelection(files)
  if (validationError) {
    throw new Error(validationError)
  }

  return Promise.all(files.map((file) => uploadAttachment(file, userId)))
}

export async function getSignedAttachmentUrl(path: string, expiresIn = SIGNED_URL_TTL_SECONDS) {
  const { data, error } = await supabase.storage
    .from(ATTACHMENTS_BUCKET)
    .createSignedUrl(path, expiresIn)

  if (error || !data?.signedUrl) {
    throw new Error(error?.message || "Unable to generate attachment link.")
  }

  return data.signedUrl
}

export async function resolveAttachmentUrls(
  attachments: Attachment[] | null | undefined,
  expiresIn = SIGNED_URL_TTL_SECONDS,
): Promise<AttachmentWithUrl[]> {
  if (!attachments?.length) return []

  const signedAttachments = await Promise.all(
    attachments.map(async (attachment) => {
      if (attachment.url) {
        return { ...attachment, url: attachment.url }
      }

      const path = attachment.path || attachment.id
      if (!path) {
        throw new Error("Attachment path is missing.")
      }

      const signedUrl = await getSignedAttachmentUrl(path, expiresIn)

      return {
        ...attachment,
        path,
        url: signedUrl,
      }
    }),
  )

  return signedAttachments
}
