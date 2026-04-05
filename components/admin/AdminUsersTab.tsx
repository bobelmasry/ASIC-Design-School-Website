"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Users,
  Search,
  Shield,
  ShieldOff,
} from "lucide-react"

type User = {
  id: string
  email: string
  name: string
  role: 'admin' | 'member'
  created_at: string
  last_sign_in_at: string | null
}

interface AdminUsersTabProps {
  users: User[]
  usersLoading: boolean
  usersError: string | null
  searchQuery: string
  updatingUserId: string | null
  onSearchChange: (query: string) => void
  onRefreshUsers: () => void
  onUpdateUserRole: (userId: string, role: 'admin' | 'member') => void
}

export function AdminUsersTab({
  users,
  usersLoading,
  usersError,
  searchQuery,
  updatingUserId,
  onSearchChange,
  onRefreshUsers,
  onUpdateUserRole
}: AdminUsersTabProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Users ({users.length})
        </CardTitle>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-8"
            />
          </div>
          <Button variant="outline" onClick={onRefreshUsers} disabled={usersLoading} className="w-full sm:w-auto">
            {usersLoading ? "Loading..." : "Refresh"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {usersLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <Card key={`loading-user-${index}`} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-muted flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-muted rounded w-48" />
                        <div className="h-3 bg-muted rounded w-32" />
                      </div>
                    </div>
                    <div className="h-6 w-16 bg-muted rounded self-end sm:self-center flex-shrink-0" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : usersError ? (
          <p className="text-center text-destructive py-8">{usersError}</p>
        ) : (
          <div className="space-y-4">
            {users
              .filter(user =>
                user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                user.id.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((user) => (
                <Card key={user.id}>
                  <CardContent>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-10 w-10 flex-shrink-0">
                          <AvatarImage src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0ea5e9&color=fff`} alt={user.name} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold truncate">{user.name}</h3>
                          <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                          <p className="text-xs text-muted-foreground font-mono truncate">{user.id}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="flex-shrink-0">
                          {user.role === 'admin' ? (
                            <Shield className="h-3 w-3 mr-1" />
                          ) : (
                            <ShieldOff className="h-3 w-3 mr-1" />
                          )}
                          {user.role}
                        </Badge>
                        <Checkbox
                          checked={user.role === 'admin'}
                          onCheckedChange={(checked) => onUpdateUserRole(user.id, checked ? 'admin' : 'member')}
                          disabled={updatingUserId === user.id}
                          className="flex-shrink-0"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}