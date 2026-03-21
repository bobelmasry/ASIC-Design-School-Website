"use client"

import * as React from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/components/auth-context"
import { forumPosts, forumCategories } from "@/lib/placeholder-data"
import {
  Search,
  Plus,
  MessageSquare,
  Eye,
  ThumbsUp,
  Clock,
  Pin,
  Filter,
  TrendingUp,
  Flame,
} from "lucide-react"

type SortOption = "recent" | "popular" | "trending"

export default function ForumPage() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get("category")
  const { openAuthModal, isAuthenticated } = useAuth()

  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(categoryParam)
  const [sortBy, setSortBy] = React.useState<SortOption>("recent")

  const filteredPosts = React.useMemo(() => {
    let posts = [...forumPosts]

    // Filter by category
    if (selectedCategory) {
      posts = posts.filter((post) => post.category.toLowerCase() === selectedCategory.toLowerCase())
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      posts = posts.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.excerpt.toLowerCase().includes(query) ||
          post.tags.some((tag) => tag.toLowerCase().includes(query))
      )
    }

    // Sort posts
    switch (sortBy) {
      case "popular":
        posts.sort((a, b) => b.likes - a.likes)
        break
      case "trending":
        posts.sort((a, b) => b.views - a.views)
        break
      case "recent":
      default:
        posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }

    // Pinned posts always first
    posts.sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0))

    return posts
  }, [selectedCategory, searchQuery, sortBy])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 48) return "Yesterday"
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  return (
    <div className="container px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Community Forum</h1>
          <p className="text-muted-foreground">
            Ask questions, share knowledge, and connect with fellow ASIC engineers
          </p>
        </div>
        {isAuthenticated ? (
          <Button asChild>
            <Link href="/forum/new">
              <Plus className="h-4 w-4 mr-2" />
              New Discussion
            </Link>
          </Button>
        ) : (
          <Button onClick={openAuthModal}>
            <Plus className="h-4 w-4 mr-2" />
            New Discussion
          </Button>
        )}
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <aside className="lg:col-span-1 space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search discussions..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Categories */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Categories
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  !selectedCategory
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                }`}
              >
                All Categories
              </button>
              {forumCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center justify-between ${
                    selectedCategory === category.id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <category.icon className="h-4 w-4" />
                    {category.name}
                  </span>
                  <Badge
                    variant={selectedCategory === category.id ? "secondary" : "outline"}
                    className="text-xs"
                  >
                    {category.count}
                  </Badge>
                </button>
              ))}
            </CardContent>
          </Card>
        </aside>

        {/* Main Content */}
        <main className="lg:col-span-3">

          {/* Posts List */}
          <div className="space-y-2 flex flex-col">
            {filteredPosts.length === 0 ? (
              <Card className="p-8 text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">No discussions found</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Try adjusting your search or filters
                </p>
                <Button variant="outline" onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory(null)
                }}>
                  Clear Filters
                </Button>
              </Card>
            ) : (
              filteredPosts.map((post) => (
                <Link key={post.id} href={`/forum/${post.id}`}>
                  <Card className="hover:border-primary/50 transition-all hover:shadow-md">
                    <CardContent className="p-4">
                      <div className="flex gap-4">
                        {/* Author Avatar */}
                        <Avatar className="h-10 w-10 hidden sm:block">
                          <AvatarImage src={post.author.avatar} alt={post.author.name} />
                          <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                        </Avatar>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              {post.isPinned && (
                                <Pin className="h-4 w-4 text-primary shrink-0" />
                              )}
                              {post.isHot && (
                                <Flame className="h-4 w-4 text-orange-500 shrink-0" />
                              )}
                              <h3 className="font-semibold hover:text-primary transition-colors line-clamp-1">
                                {post.title}
                              </h3>
                            </div>
                            <Badge variant="outline" className="shrink-0 text-xs">
                              {post.category}
                            </Badge>
                          </div>

                          <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                            {post.excerpt}
                          </p>

                          <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Avatar className="h-4 w-4">
                                <AvatarImage src={post.author.avatar} />
                                <AvatarFallback className="text-[8px]">
                                  {post.author.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              {post.author.name}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatDate(post.createdAt)}
                            </span>
                            <span className="flex items-center gap-1">
                              <MessageSquare className="h-3 w-3" />
                              {post.replies}
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {post.views}
                            </span>
                            <span className="flex items-center gap-1">
                              <ThumbsUp className="h-3 w-3" />
                              {post.likes}
                            </span>
                          </div>

                          {post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {post.tags.slice(0, 3).map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                              {post.tags.length > 3 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{post.tags.length - 3}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            )}
          </div>

          {/* Load More */}
          {filteredPosts.length > 0 && (
            <div className="text-center mt-8">
              <Button variant="outline">Load More Discussions</Button>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
