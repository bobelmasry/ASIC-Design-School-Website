import { supabase } from "@/lib/supabase"
import type { DatabasePost, PostReply } from "@/components/forum/forum-post-card"
import type { Attachment } from "@/lib/attachments"

export const getPost = async (id: string) => {
  return await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single()
}

export const updatePostLikes = async (postId: string | number, updatedLikes: number, updatedLikedUsers: string[]) => {
  return await supabase
    .from("posts")
    .update({ likes: updatedLikes, json_likes: updatedLikedUsers })
    .eq("id", postId)
}

export const updatePostReplies = async (postId: string | number, updatedReplies: PostReply[]) => {
  return await supabase
    .from("posts")
    .update({
      replies: updatedReplies,
      replies_count: updatedReplies.length,
    })
    .eq("id", postId)
    .select("*")
    .single()
}

export const deletePost = async (postId: string | number) => {
  return await supabase
    .from("posts")
    .delete()
    .eq("id", postId)
}

export const updateReplyStatus = async (postId: string | number, updatedReplies: PostReply[]) => {
  return await supabase
    .from("posts")
    .update({ replies: updatedReplies })
    .eq("id", postId)
    .select("*")
    .single()
}

export const updateReplyLike = async (postId: string | number, updatedReplies: PostReply[]) => {
  return await supabase
    .from("posts")
    .update({ replies: updatedReplies })
    .eq("id", postId)
    .select("replies")
    .single()
}
