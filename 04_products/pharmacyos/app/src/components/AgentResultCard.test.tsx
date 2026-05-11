import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { AgentResultCard } from './AgentResultCard'
import { type AIJob } from '@/data/sample'

const BASE_JOB: AIJob = {
  id: 'JOB001',
  jobNumber: 'AGT-001',
  type: 'drug-interaction',
  label: 'Drug Interaction Check',
  target: 'RX001',
  status: 'Completed',
  createdAt: '2026-05-11 09:00',
  inputSummary: 'Metformin 500mg, Atorvastatin 20mg',
  outputSummary: 'No critical interactions detected.',
  confidence: 0.92,
}

describe('AgentResultCard', () => {
  it('renders label in full variant', () => {
    render(<AgentResultCard job={BASE_JOB} />)
    expect(screen.getByText('Drug Interaction Check')).toBeInTheDocument()
  })

  it('renders output summary in full variant', () => {
    render(<AgentResultCard job={BASE_JOB} />)
    expect(screen.getByText('No critical interactions detected.')).toBeInTheDocument()
  })

  it('renders confidence percentage', () => {
    render(<AgentResultCard job={BASE_JOB} />)
    expect(screen.getByText('92%')).toBeInTheDocument()
  })

  it('renders job status', () => {
    render(<AgentResultCard job={BASE_JOB} />)
    expect(screen.getByText('Completed')).toBeInTheDocument()
  })

  it('calls onAction when action button clicked', () => {
    const onAction = vi.fn()
    render(<AgentResultCard job={BASE_JOB} onAction={onAction} actionLabel="View in Queue" />)
    fireEvent.click(screen.getByText('View in Queue'))
    expect(onAction).toHaveBeenCalledTimes(1)
  })

  it('calls onDismiss when dismiss button clicked', () => {
    const onDismiss = vi.fn()
    render(<AgentResultCard job={BASE_JOB} onDismiss={onDismiss} />)
    fireEvent.click(screen.getByRole('button', { name: /dismiss/i }))
    expect(onDismiss).toHaveBeenCalledTimes(1)
  })

  it('shows flag note when job is flagged', () => {
    const flaggedJob: AIJob = {
      ...BASE_JOB,
      flagged: true,
      flagNote: 'Requires pharmacist review before dispensing.',
    }
    render(<AgentResultCard job={flaggedJob} />)
    expect(screen.getByText('Requires pharmacist review before dispensing.')).toBeInTheDocument()
  })

  it('renders integration pending badge when integrationPending is set', () => {
    const job: AIJob = { ...BASE_JOB, integrationPending: ['NHF', 'Insurance'] }
    render(<AgentResultCard job={job} />)
    expect(screen.getAllByText(/NHF/i).length).toBeGreaterThan(0)
  })

  it('renders compact variant without crashing', () => {
    render(<AgentResultCard job={BASE_JOB} compact />)
    expect(screen.getByText('Drug Interaction Check')).toBeInTheDocument()
  })

  it('does not render action button when onAction is not provided', () => {
    render(<AgentResultCard job={BASE_JOB} />)
    expect(screen.queryByRole('button', { name: /View Details/i })).not.toBeInTheDocument()
  })
})
