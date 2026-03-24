"use client"

import * as React from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/components/auth-context"
import { forumCategories } from "@/lib/placeholder-data"
import { supabase } from "@/lib/supabase"
import {
  Search,
  Plus,
  MessageSquare,
  ThumbsUp,
  Clock,
  Filter,
} from "lucide-react"

type DatabasePost = {
  id: string | number
  title: string | null
  excerpt?: string | null
  content?: string | null
  category?: string | null
  created_at?: string | null
  replies?: number | null
  replies_count?: number | null
  views?: number | null
  likes?: number | null
  user_id?: string | null
  user_full_name?: string | null
  json_likes?: string[] | null
}

type ForumPostWithAuthor = {
  id: string
  title: string
  excerpt: string
  category: string
  createdAt: string
  replies: number
  likes: number
  author: {
    id: string
    name: string
    avatar?: string
  }
}

function ForumPageContent() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get("category")
  const { openAuthModal, isAuthenticated } = useAuth()

  const [posts, setPosts] = React.useState<ForumPostWithAuthor[]>([])
  const [isLoadingPosts, setIsLoadingPosts] = React.useState(true)
  const [fetchError, setFetchError] = React.useState<string | null>(null)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(categoryParam)

  React.useEffect(() => {
    if (!categoryParam) return
    setSelectedCategory(categoryParam)
  }, [categoryParam])

  React.useEffect(() => {
    let isMounted = true

    const loadPosts = async () => {
      setIsLoadingPosts(true)
      const { data: postRows, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false })

      if (!isMounted) return

      if (error) {
        setFetchError(error.message ?? "Failed to load discussions.")
        setIsLoadingPosts(false)
        return
      }

      const normalizedPosts = postRows ?? []

      const mappedPosts: ForumPostWithAuthor[] = normalizedPosts.map((post) => {
        const name = post.user_full_name || "Community Member"
        const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0ea5e9&color=fff`

        return {
          id: String(post.id),
          title: post.title ?? "Untitled discussion",
          excerpt:
            post.excerpt ??
            (post.content ? `${post.content.slice(0, 160)}...` : ""),
          category: post.category ?? "General",
          createdAt: post.created_at ?? new Date().toISOString(),
          replies: post.replies_count ?? post.replies ?? 0,
          likes: post.likes ?? (Array.isArray(post.json_likes) ? post.json_likes.length : 0),
          author: {
            id: post.user_id ?? "unknown",
            name,
            avatar,
          },
        }
      })

      setPosts(mappedPosts)
      setFetchError(null)
      setIsLoadingPosts(false)
    }

    loadPosts()

    return () => {
      isMounted = false
    }
  }, [])

  const filteredPosts = React.useMemo(() => {
    let postsToFilter = [...posts]

    // Filter by category
    if (selectedCategory) {
      postsToFilter = postsToFilter.filter(
        (post) => post.category.toLowerCase() === selectedCategory.toLowerCase(),
      )
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      postsToFilter = postsToFilter.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.excerpt.toLowerCase().includes(query),
      )
    }

    // Sort posts by newest first (database does not expose popularity metadata)
    postsToFilter.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )

    return postsToFilter
  }, [posts, selectedCategory, searchQuery])

  const categoryCounts = React.useMemo(() => {
    const counts: Record<string, number> = {}
    posts.forEach((post) => {
      const key = post.category?.toLowerCase()
      if (!key) return
      counts[key] = (counts[key] ?? 0) + 1
    })
    return counts
  }, [posts])

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "Just now"
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
              className="pl-10 border-gray-300 dark:border-gray-800"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Categories */}
          <Card className="border-gray-300 dark:border-gray-800">
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
                <span className="flex items-center justify-between">
                  <span>All Categories</span>
                  <Badge
                    variant={!selectedCategory ? "secondary" : "outline"}
                    className="text-xs"
                  >
                    {posts.length}
                  </Badge>
                </span>
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
                    {categoryCounts[category.slug.toLowerCase()] ?? 0}
                  </Badge>
                </button>
              ))}
            </CardContent>
          </Card>
        </aside>

        {/* Main Content */}
        <main className="lg:col-span-3">

          {/* Posts List */}
          <div className="space-y-4 flex flex-col">
            {fetchError ? (
              <Card className="p-8 text-center border-red-200 dark:border-red-900/40">
                <MessageSquare className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="font-semibold mb-2">{fetchError}</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Please refresh the page or try again later.
                </p>
                <Button variant="outline" onClick={() => window.location.reload()}>
                  Retry
                </Button>
              </Card>
            ) : isLoadingPosts ? (
              Array.from({ length: 4 }).map((_, index) => (
                <Card
                  key={`forum-loading-${index}`}
                  className="border-gray-300 dark:border-gray-800"
                >
                  <CardContent className="p-4 animate-pulse space-y-4">
                    <div className="flex gap-4">
                      <div className="h-10 w-10 rounded-full bg-muted shrink-0" />
                      <div className="flex-1 space-y-3">
                        <div className="h-4 bg-muted rounded w-2/3" />
                        <div className="h-3 bg-muted rounded w-5/6" />
                        <div className="flex gap-3">
                          <div className="h-3 bg-muted rounded w-16" />
                          <div className="h-3 bg-muted rounded w-12" />
                          <div className="h-3 bg-muted rounded w-10" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : filteredPosts.length === 0 ? (
              <Card className="p-8 text-center border-gray-300 dark:border-gray-800">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">No discussions found</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Try adjusting your search or filters
                </p>
                <Button variant="outline" className="dark:hover:text-white hover:text-black dark:hover:bg-gray-800" onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory(null)
                }}>
                  Clear Filters
                </Button>
              </Card>
            ) : (
              filteredPosts.map((post) => (
                <Link key={post.id} href={`/forum/${post.id}`}>
                  <Card className="hover:border-primary/50 transition-all hover:shadow-md border-gray-300 dark:border-gray-800">
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
                               <ThumbsUp className="h-3 w-3" />
                               {post.likes}
                             </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

function ForumPageFallback() {
  return (
    <div className="container px-4 py-8">
      <div className="space-y-4 flex flex-col">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={`forum-fallback-${index}`} className="border-gray-300 dark:border-gray-800">
            <CardContent className="p-4 animate-pulse space-y-4">
              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-full bg-muted shrink-0" />
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-muted rounded w-2/3" />
                  <div className="h-3 bg-muted rounded w-5/6" />
                  <div className="flex gap-3">
                    <div className="h-3 bg-muted rounded w-16" />
                    <div className="h-3 bg-muted rounded w-12" />
                    <div className="h-3 bg-muted rounded w-10" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default function ForumPage() {
  return (
    <React.Suspense fallback={<ForumPageFallback />}>
      <ForumPageContent />
    </React.Suspense>
  )
}
