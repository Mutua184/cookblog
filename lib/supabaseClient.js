import { createClient } from '@supabase/supabase-js'

// Replace these with your actual Supabase values:
const supabaseUrl = 'https://gpqmnjtokzyyqfilmlys.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdwcW1uanRva3p5eXFmaWxtbHlzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwODkzNTUsImV4cCI6MjA2NzY2NTM1NX0.Bq_LXGPBWkX80NqrUZJaQtHBIkRmNsu-PXzBKVtKTdU'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

