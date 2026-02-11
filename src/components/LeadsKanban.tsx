import { useEffect, useMemo, useState } from 'react'
import { Box, Paper, Stack, Typography } from '@mui/material'
import useConsultores from '../hooks/useConsultores'

// Simple mock lead type
type Lead = {
  id: string
  titulo: string
  detalhe?: string
}

// Column model for Kanban
type Column = {
  id: string
  title: string
}

type BoardState = Record<string, Lead[]>

function makeMockLeads(): Lead[] {
  return [
    { id: 'L-1001', titulo: 'João da Silva', detalhe: 'Plano Empresa • Inbound' },
    { id: 'L-1002', titulo: 'Maria Oliveira', detalhe: 'PF • Indicação' },
    { id: 'L-1003', titulo: 'ACME Ltda', detalhe: 'PJ • Site' },
    { id: 'L-1004', titulo: 'Pedro Souza', detalhe: 'PF • WhatsApp' },
    { id: 'L-1005', titulo: 'TechCorp', detalhe: 'PJ • Evento' },
  ]
}

export default function LeadsKanban() {
  const { data: consultores } = useConsultores()

  const columns: Column[] = useMemo(() => {
    const cols: Column[] = [{ id: 'novos', title: 'Novos Leads' }]
    ;(consultores ?? []).forEach((c) => cols.push({ id: c.id, title: c.nomeCompleto }))
    return cols
  }, [consultores])

  const [board, setBoard] = useState<BoardState>({})
  const [hoverCol, setHoverCol] = useState<string | null>(null)

  // Initialize board with all leads in "novos"
  useEffect(() => {
    const initial: BoardState = { novos: makeMockLeads() }
    ;(consultores ?? []).forEach((c) => {
      initial[c.id] = initial[c.id] ?? []
    })
    setBoard(initial)
  }, [consultores])

  // Drag state via native HTML5 DnD
  function onDragStart(e: React.DragEvent, leadId: string, fromCol: string) {
    e.dataTransfer.setData('text/plain', JSON.stringify({ leadId, fromCol }))
    // Optional: customize drag image or effect
    e.dataTransfer.effectAllowed = 'move'
  }

  function onDragOver(e: React.DragEvent) {
    // Allow drop
    e.preventDefault()
  }

  function onDragEnter(e: React.DragEvent, colId: string) {
    e.preventDefault()
    setHoverCol(colId)
  }

  function onDragLeave(e: React.DragEvent, colId: string) {
    e.preventDefault()
    setHoverCol((c) => (c === colId ? null : c))
  }

  function onDrop(e: React.DragEvent, toCol: string) {
    e.preventDefault()
    setHoverCol(null)
    const payload = e.dataTransfer.getData('text/plain')
    if (!payload) return
    try {
      const { leadId, fromCol } = JSON.parse(payload) as { leadId: string; fromCol: string }
      if (!leadId || !fromCol) return
      if (fromCol === toCol) return

      setBoard((prev) => {
        const source = [...(prev[fromCol] ?? [])]
        const target = [...(prev[toCol] ?? [])]
        const idx = source.findIndex((l) => l.id === leadId)
        if (idx === -1) return prev
        const [moved] = source.splice(idx, 1)
        target.unshift(moved)
        return { ...prev, [fromCol]: source, [toCol]: target }
      })
    } catch {}
  }

  return (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start', overflowX: 'auto' }}>
      {columns.map((col) => {
        const leads = board[col.id] ?? []
        return (
          <Paper
            key={col.id}
            sx={{
              minWidth: 280,
              maxWidth: 320,
              p: 2,
              backgroundColor: hoverCol === col.id ? 'action.hover' : 'background.paper',
              border: '2px solid',
              borderColor: hoverCol === col.id ? 'primary.main' : 'divider',
              transition: 'background-color 0.15s ease, border-color 0.15s ease',
            }}
            onDragOver={onDragOver}
            onDragEnter={(e) => onDragEnter(e, col.id)}
            onDragLeave={(e) => onDragLeave(e, col.id)}
            onDrop={(e) => onDrop(e, col.id)}
          >
            <Stack spacing={2}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle1" noWrap>
                  {col.title}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {leads.length}
                </Typography>
              </Stack>
              <Stack spacing={1}>
                {leads.map((lead) => (
                  <Paper
                    key={lead.id}
                    draggable
                    onDragStart={(e) => onDragStart(e, lead.id, col.id)}
                    sx={{ p: 1.5, cursor: 'grab', '&:active': { cursor: 'grabbing' } }}
                    elevation={1}
                  >
                    <Typography variant="body2" fontWeight={600} noWrap>{lead.titulo}</Typography>
                    {lead.detalhe && (
                      <Typography variant="caption" color="text.secondary" noWrap>
                        {lead.detalhe}
                      </Typography>
                    )}
                  </Paper>
                ))}
                {leads.length === 0 && (
                  <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.7 }}>
                    Sem leads
                  </Typography>
                )}
              </Stack>
            </Stack>
          </Paper>
        )
      })}
    </Box>
  )
}
