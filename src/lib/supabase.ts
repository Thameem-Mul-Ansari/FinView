import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://oiznbgffevzfevtcxuod.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9pem5iZ2ZmZXZ6ZmV2dGN4dW9kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIzNDYwMDIsImV4cCI6MjA0NzkyMjAwMn0.6QZQH3vS1NcWHPvYcEvC2Yd_ZXhKmcEQwHQfohTc2dA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);