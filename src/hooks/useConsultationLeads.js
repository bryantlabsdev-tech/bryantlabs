import { useCallback, useEffect, useRef, useState } from "react"
import { getLeadStatusLabel } from "../config/admin"
import { getSupabaseClient } from "../lib/supabaseClient"

const PAGE_SIZE = 25

async function safeInsertLeadActivity(supabase, row) {
  try {
    const { error } = await supabase.from("lead_activities").insert([row])

    if (error) {
      console.warn("[Bryant Labs] lead_activities insert skipped:", error.message)
    }
  } catch (error) {
    console.warn("[Bryant Labs] lead_activities insert failed:", error)
  }
}

function replaceLead(leads, nextLead) {
  return leads.map((lead) => (lead.id === nextLead.id ? nextLead : lead))
}

function appendUniqueLeads(existing, batch) {
  const ids = new Set(existing.map((lead) => lead.id))
  const merged = [...existing]

  for (const lead of batch) {
    if (!ids.has(lead.id)) {
      merged.push(lead)
      ids.add(lead.id)
    }
  }

  return merged
}

export function useConsultationLeads() {
  const [leads, setLeads] = useState([])
  const leadsRef = useRef([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    leadsRef.current = leads
  }, [leads])

  const fetchPage = useCallback(async (from) => {
    const supabase = getSupabaseClient()
    const to = from + PAGE_SIZE - 1

    const { data, error: fetchError } = await supabase
      .from("consultation_leads")
      .select("*")
      .order("created_at", { ascending: false })
      .range(from, to)

    if (fetchError) {
      throw fetchError
    }

    return data ?? []
  }, [])

  const loadLeads = useCallback(
    async ({ showLoading = true } = {}) => {
      if (showLoading) {
        setLoading(true)
      }

      setError("")

      try {
        const batch = await fetchPage(0)
        setLeads(batch)
        setHasMore(batch.length === PAGE_SIZE)
      } catch (loadError) {
        setError(
          loadError?.message ?? "We could not load consultation leads right now.",
        )
        setLeads([])
        setHasMore(false)
      } finally {
        if (showLoading) {
          setLoading(false)
        }
      }
    },
    [fetchPage],
  )

  const loadMoreLeads = useCallback(async () => {
    if (loadingMore || !hasMore) {
      return
    }

    setLoadingMore(true)

    try {
      const from = leadsRef.current.length
      const batch = await fetchPage(from)
      setLeads((current) => appendUniqueLeads(current, batch))
      setHasMore(batch.length === PAGE_SIZE)
    } catch (loadError) {
      setError(
        loadError?.message ?? "We could not load more consultation leads right now.",
      )
    } finally {
      setLoadingMore(false)
    }
  }, [fetchPage, hasMore, loadingMore])

  useEffect(() => {
    let active = true

    async function loadInitialLeads() {
      try {
        const batch = await fetchPage(0)

        if (!active) {
          return
        }

        setLeads(batch)
        setHasMore(batch.length === PAGE_SIZE)
        setError("")
      } catch (loadError) {
        if (!active) {
          return
        }

        setError(
          loadError?.message ?? "We could not load consultation leads right now.",
        )
        setLeads([])
        setHasMore(false)
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    void loadInitialLeads()

    return () => {
      active = false
    }
  }, [fetchPage])

  const updateLeadStatus = useCallback(async (leadId, status) => {
    const supabase = getSupabaseClient()
    const now = new Date().toISOString()

    const { data, error: updateError } = await supabase
      .from("consultation_leads")
      .update({
        status,
        last_contacted_at: now,
        updated_at: now,
      })
      .eq("id", leadId)
      .select("*")
      .single()

    if (updateError) {
      throw updateError
    }

    await safeInsertLeadActivity(supabase, {
      lead_id: leadId,
      event_type: "status_change",
      summary: `Status set to ${getLeadStatusLabel(status)}`,
      metadata: { status },
    })

    setLeads((current) => replaceLead(current, data))

    return data
  }, [])

  const updateLeadNotes = useCallback(async (leadId, adminNotes) => {
    const supabase = getSupabaseClient()
    const now = new Date().toISOString()

    const { data, error: updateError } = await supabase
      .from("consultation_leads")
      .update({
        admin_notes: adminNotes,
        last_contacted_at: now,
        updated_at: now,
      })
      .eq("id", leadId)
      .select("*")
      .single()

    if (updateError) {
      throw updateError
    }

    await safeInsertLeadActivity(supabase, {
      lead_id: leadId,
      event_type: "note_saved",
      summary: "Note updated",
      metadata: {},
    })

    setLeads((current) => replaceLead(current, data))

    return data
  }, [])

  const markIntroLinkScheduled = useCallback(async (leadId) => {
    const supabase = getSupabaseClient()
    const now = new Date().toISOString()

    const { data, error: updateError } = await supabase
      .from("consultation_leads")
      .update({
        status: "intro_scheduled",
        intro_link_sent_at: now,
        last_contacted_at: now,
        updated_at: now,
      })
      .eq("id", leadId)
      .select("*")
      .single()

    if (updateError) {
      throw updateError
    }

    await safeInsertLeadActivity(supabase, {
      lead_id: leadId,
      event_type: "intro_sent",
      summary: "Intro call link sent",
      metadata: {},
    })

    setLeads((current) => replaceLead(current, data))

    return data
  }, [])

  const updateFollowUp = useCallback(async (leadId, { nextFollowUpDate, followUpNote }) => {
    const supabase = getSupabaseClient()
    const now = new Date().toISOString()

    let nextFollowUpAt = null

    if (nextFollowUpDate) {
      const parsed = new Date(`${nextFollowUpDate}T12:00:00`)
      nextFollowUpAt = Number.isNaN(parsed.getTime()) ? null : parsed.toISOString()
    }

    const trimmedNote = String(followUpNote ?? "").trim() || null

    const { data, error: updateError } = await supabase
      .from("consultation_leads")
      .update({
        next_follow_up_at: nextFollowUpAt,
        follow_up_note: trimmedNote,
        last_contacted_at: now,
        updated_at: now,
      })
      .eq("id", leadId)
      .select("*")
      .single()

    if (updateError) {
      throw updateError
    }

    const summary = nextFollowUpAt
      ? `Follow-up scheduled for ${new Intl.DateTimeFormat(undefined, {
          dateStyle: "medium",
        }).format(new Date(nextFollowUpAt))}`
      : "Follow-up reminder cleared"

    await safeInsertLeadActivity(supabase, {
      lead_id: leadId,
      event_type: "follow_up_set",
      summary,
      metadata: {},
    })

    setLeads((current) => replaceLead(current, data))

    return data
  }, [])

  return {
    leads,
    loading,
    loadingMore,
    hasMore,
    error,
    reloadLeads: () => loadLeads({ showLoading: true }),
    loadMoreLeads,
    updateLeadStatus,
    updateLeadNotes,
    markIntroLinkScheduled,
    updateFollowUp,
  }
}
