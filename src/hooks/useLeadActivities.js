import { useCallback, useEffect, useState } from "react"
import { getSupabaseClient } from "../lib/supabaseClient"

export function useLeadActivities(leadId, syncKey) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)

  const load = useCallback(async () => {
    if (!leadId) {
      setItems([])
      return
    }

    setLoading(true)

    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase
        .from("lead_activities")
        .select("id, created_at, event_type, summary, metadata")
        .eq("lead_id", leadId)
        .order("created_at", { ascending: false })
        .limit(50)

      if (error) {
        throw error
      }

      setItems(data ?? [])
    } catch {
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [leadId])

  useEffect(() => {
    queueMicrotask(() => {
      void load()
    })
  }, [load, syncKey])

  return { items, loading, reloadActivities: load }
}
