import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase environment variables are required for server auth')
}

export const getBearerToken = (request: Request) => {
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) return null
  return authHeader.slice('Bearer '.length)
}

export const getAuthenticatedUser = async (request: Request) => {
  const token = getBearerToken(request)
  if (!token) return { token: null, user: null }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  })

  const { data, error } = await supabase.auth.getUser(token)
  if (error || !data.user) return { token, user: null }

  return { token, user: data.user }
}

export const createAuthedSupabaseClient = (token: string) =>
  createClient(supabaseUrl, supabaseAnonKey, {
    global: {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  })

export const createServerSupabaseClient = () =>
  createClient(supabaseUrl, supabaseAnonKey)
