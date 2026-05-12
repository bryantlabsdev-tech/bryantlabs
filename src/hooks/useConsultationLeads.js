import { useCallback, useEffect, useState } from "react"
import { getSupabaseClient } from "../lib/supabaseClient"

async function fetchConsultationLeads() {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from("consultation_leads")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    throw error
  }

  return data ?? []
}

function replaceLead(leads, nextLead) {
  return leads.map((lead) => (lead.id === nextLead.id ? nextLead : lead))
}

export function useConsultationLeads() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const loadLeads = useCallback(async ({ showLoading = true } = {}) => {
    if (showLoading) {
      setLoading(true)
    }

    setError("")

    try {
      const nextLeads = await fetchConsultationLeads()
      setLeads(nextLeads)
    } catch (loadError) {
      setError(
        loadError?.message ?? "We could not load consultation leads right now.",
      )
      setLeads([])
    } finally {
      if (showLoading) {
        setLoading(false)
      }
    }
  }, [])

  useEffect(() => {
    let active = true

    async function loadInitialLeads() {
      try {
        const nextLeads = await fetchConsultationLeads()

        if (!active) {
          return
        }

        setLeads(nextLeads)
        setError("")
      } catch (loadError) {
        if (!active) {
          return
        }

        setError(
          loadError?.message ?? "We could not load consultation leads right now.",
        )
        setLeads([])
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
  }, [])

  const updateLeadStatus = useCallback(async (leadId, status) => {
    const supabase = getSupabaseClient()
    const { data, error: updateError } = await supabase
      .from("consultation_leads")
      .update({ status })
      .eq("id", leadId)
      .select("*")
      .single()

    if (updateError) {
      throw updateError
    }

    setLeads((current) => replaceLead(current, data))

    return data
  }, [])

  const updateLeadNotes = useCallback(async (leadId, adminNotes) => {
    const supabase = getSupabaseClient()
    const { data, error: updateError } = await supabase
      .from("consultation_leads")
      .update({ admin_notes: adminNotes })
      .eq("id", leadId)
      .select("*")
      .single()

    if (updateError) {
      throw updateError
    }

    setLeads((current) => replaceLead(current, data))

    return data
  }, [])

  const markIntroLinkScheduled = useCallback(async (leadId) => {
    const supabase = getSupabaseClient()
    const { data, error: updateError } = await supabase
      .from("consultation_leads")
      .update({
        status: "intro_scheduled",
        intro_link_sent_at: new Date().toISOString(),
      })
      .eq("id", leadId)
      .select("*")
      .single()

    if (updateError) {
      throw updateError
    }

    setLeads((current) => replaceLead(current, data))

    return data
  }, [])

  return {
    leads,
    loading,
    error,
    reloadLeads: () => loadLeads({ showLoading: true }),
    updateLeadStatus,
    updateLeadNotes,
    markIntroLinkScheduled,
  }
}
