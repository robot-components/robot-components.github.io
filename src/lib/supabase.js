import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://srgpmgjzqaqddlcfebxu.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyZ3BtZ2p6cWFxZGRsY2ZlYnh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4NDgxNjIsImV4cCI6MjA5NTQyNDE2Mn0.xvaXQ075ZQz__zxZQbNJSLBWBsix9yN-cEMqBuSb85M";

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
