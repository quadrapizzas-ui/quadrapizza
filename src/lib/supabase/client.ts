import { createClient } from '@supabase/supabase-js'
import { Database } from '@/types/database.types'

// Variables de entorno que se configurarán en Vercel/.env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
