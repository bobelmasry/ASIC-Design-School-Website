"use client"

import * as React from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

// Utility function to parse and render links and @mentions in text
export const parseLinks = (text: string) => {
  if (!text) return null

  // Use a regex with capturing groups to keep the matched delimiters
  const urlRegex = /(https?:\/\/[^\s]+|@[^@\n]+@)/g
  const parts = text.split(urlRegex)

  return parts.map((part, index) => {
    if (!part) return null

    // Check if part is a URL
    if (part.match(/^https?:\/\//)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline break-all"
        >
          {part}
        </a>
      )
    } 
    
    // Check if part is a mention (starts and ends with @)
    if (part.startsWith('@') && part.endsWith('@') && part.length > 2) {
      const displayName = part.slice(0, -1) // Strip trailing @
      return (
        <span key={index} className="text-primary font-medium bg-primary/10 px-1 rounded inline-block">
          {displayName}
        </span>
      )
    }

    // Regular text with line breaks
    return part.split('\n').map((line, lineIndex, lineArray) => (
      <React.Fragment key={`${index}-${lineIndex}`}>
        {line}
        {lineIndex < lineArray.length - 1 && <br />}
      </React.Fragment>
    ))
  })
}

interface ForumContentProps {
  content: string
  isMarkdown?: boolean | null
  className?: string
}

export function ForumContent({ content, isMarkdown, className = "" }: ForumContentProps) {
  return (
    <div className={`prose prose-neutral dark:prose-invert max-w-none ${className}`}>
      {isMarkdown ? (
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {content}
        </ReactMarkdown>
      ) : (
        <div className="leading-relaxed">{parseLinks(content)}</div>
      )}
    </div>
  )
}
