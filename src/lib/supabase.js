import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://srgpmgjzqaqddlcfebxu.supabase.co";
const SUPABASE_KEY = "sb_publishable_J9lpISF4NgYAwLIS-dlBBQ_bDE3yt1C";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
