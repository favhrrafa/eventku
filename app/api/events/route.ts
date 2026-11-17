import { supabase } from "@/lib/supabase";
import type { Event } from "@/data/events";

export async function GET() {
    const { data, error } = await supabase.from("events").select("*").order("harga", { ascending: false });
    if (error) return Response.json({ error: error.message }, { status: 500 });
    return Response.json(data as Event[]);
}