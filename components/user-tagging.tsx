"use client"

import * as React from "react"
import { supabase } from "@/lib/supabase"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import { useAuth } from "@/components/auth-context"

type UserSuggestion = {
  id: string
  name: string
}

interface UserTaggingProps {
  value: string
  onChange: (value: string) => void
  onSelect?: (user: UserSuggestion) => void
  onMentionIdsChange?: (ids: string[]) => void
  placeholder?: string
  rows?: number
  className?: string
  id?: string
}

export const UserTagging = React.memo(function UserTagging({
  value,
  onChange,
  onSelect,
  onMentionIdsChange,
  placeholder,
  rows = 4,
  className,
  id
}: UserTaggingProps) {
  const [open, setOpen] = React.useState(false)
  const [suggestions, setSuggestions] = React.useState<UserSuggestion[]>([])
  const [mentionedUsers, setMentionedUsers] = React.useState<Map<string, string>>(new Map())
  const [cursorPosition, setCursorPosition] = React.useState(0)
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const { user: currentUser } = useAuth()

  // Sync mentions with parent when map changes
  React.useEffect(() => {
    if (onMentionIdsChange) {
      onMentionIdsChange(Array.from(mentionedUsers.keys()))
    }
  }, [mentionedUsers, onMentionIdsChange])

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    const position = e.target.selectionStart
    onChange(newValue)
    setCursorPosition(position)

    const textBeforeCursor = newValue.slice(0, position)
    const atIndex = textBeforeCursor.lastIndexOf("@")

    if (atIndex !== -1) {
      const query = textBeforeCursor.slice(atIndex + 1)
      if (atIndex === 0 || textBeforeCursor[atIndex - 1] === " " || textBeforeCursor[atIndex - 1] === "\n") {
        if (!query.includes(" ")) {
          setOpen(true)
          fetchUsers(query)
          return
        }
      }
    }
    setOpen(false)
  }

  const fetchUsers = async (query: string) => {
    const { data, error } = await supabase
      .from('posts')
      .select('user_id, user_full_name')
      .ilike('user_full_name', `%${query}%`)
      .limit(10)

    if (data && !error) {
      const uniqueIds = Array.from(new Set(data.map(d => d.user_id).filter(Boolean)))
      const uniqueUsers = uniqueIds
        .map(id => {
          const u = data.find(d => d.user_id === id)
          return u ? { id: u.user_id, name: u.user_full_name } : null
        })
        .filter((u): u is UserSuggestion => u !== null && u.id !== currentUser?.id)
      setSuggestions(uniqueUsers)
    }
  }

  const handleSelectUser = (user: UserSuggestion) => {
    const textBeforeAt = value.slice(0, value.lastIndexOf("@", cursorPosition - 1))
    const textAfterCursor = value.slice(cursorPosition)
    
    // We wrap the name in special characters to make it easier for our regex to find the end of the name
    // Using a non-standard bracket-like approach that we can easily target with regex
    const taggedName = `@${user.name}@`
    const newValue = `${textBeforeAt}${taggedName} ${textAfterCursor}`
    
    setMentionedUsers(prev => new Map(prev).set(user.id, user.name))
    onChange(newValue)
    setOpen(false)
    if (onSelect) onSelect(user)
    
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus()
        const newPos = textBeforeAt.length + taggedName.length + 1
        textareaRef.current.setSelectionRange(newPos, newPos)
      }
    }, 0)
  }

  return (
    <div className="relative w-full">
      <textarea
        id={id}
        ref={textareaRef}
        value={value}
        onChange={handleTextChange}
        onSelect={(e) => setCursorPosition((e.target as HTMLTextAreaElement).selectionStart)}
        placeholder={placeholder}
        rows={rows}
        className={className}
      />
      
      {open && suggestions.length > 0 && (
        <div className="absolute z-50 w-64 mt-1 bg-popover border rounded-md shadow-md bottom-full mb-2">
          <Command>
            <CommandList>
              <CommandGroup heading="Suggestions">
                {suggestions.map((suggestion) => (
                  <CommandItem
                    key={suggestion.id}
                    onSelect={() => handleSelectUser(suggestion)}
                    className="flex items-center gap-2 p-2 cursor-pointer"
                  >
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={`https://ui-avatars.com/api/?name=${encodeURIComponent(suggestion.name)}&background=0ea5e9&color=fff`} />
                      <AvatarFallback>{suggestion.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span>{suggestion.name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  )
})
