"use client"

import * as React from "react"
import { supabase } from "@/lib/supabase"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { useAuth } from "@/components/auth-context"

type UserSuggestion = {
  id: string
  name: string
}

interface UserTaggingProps {
  value: string
  onChange: (value: string) => void
  onSelect?: (user: UserSuggestion) => void
  placeholder?: string
  rows?: number
  className?: string
  id?: string
}

export function UserTagging({
  value,
  onChange,
  onSelect,
  placeholder,
  rows = 4,
  className,
  id
}: UserTaggingProps) {
  const [open, setOpen] = React.useState(false)
  const [suggestions, setSuggestions] = React.useState<UserSuggestion[]>([])
  const [cursorPosition, setCursorPosition] = React.useState(0)
  const [searchQuery, setSearchQuery] = React.useState("")
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const { user: currentUser } = useAuth()

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    const position = e.target.selectionStart
    onChange(newValue)
    setCursorPosition(position)

    // Check if we are typing a tag
    const textBeforeCursor = newValue.slice(0, position)
    const atIndex = textBeforeCursor.lastIndexOf("@")

    if (atIndex !== -1) {
      const query = textBeforeCursor.slice(atIndex + 1)
      // Only trigger if @ is at start or after a space
      if (atIndex === 0 || textBeforeCursor[atIndex - 1] === " " || textBeforeCursor[atIndex - 1] === "\n") {
        if (!query.includes(" ")) {
          setSearchQuery(query)
          setOpen(true)
          fetchUsers(query)
          return
        }
      }
    }
    setOpen(false)
  }

  const fetchUsers = async (query: string) => {
    // In a real app, you'd fetch from a 'profiles' table. 
    // Since we don't have a formal profiles table visible in the file list yet,
    // we'll fetch from the 'posts' table unique authors as a fallback or 
    // ideally the users table if we had service role access.
    // For this prototype, we'll try to get unique authors from posts.
    
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
    const newValue = `${textBeforeAt}@${user.name} ${textAfterCursor}`
    
    onChange(newValue)
    setOpen(false)
    if (onSelect) onSelect(user)
    
    // Refocus textarea
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus()
        const newPos = textBeforeAt.length + user.name.length + 2
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
}
