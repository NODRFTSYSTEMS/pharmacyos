import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { MedicationVisualReference } from '../types/database'

export function normalizeMedicationKey(value: string): string {
  return value
    .toLowerCase()
    .replace(/Ã—|×/g, 'x')
    .replace(/\+/g, ' ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-x(\d+)/g, '-$1')
    .replace(/^-+|-+$/g, '')
}

export function useMedicationVisualReferences(drugNames: string[]) {
  const keys = useMemo(
    () => Array.from(new Set(
      drugNames
        .map(name => normalizeMedicationKey(name))
        .filter(Boolean)
    )),
    [drugNames.join('|')]
  )

  return useQuery<Record<string, MedicationVisualReference>>({
    queryKey: ['medication-visual-references', keys],
    enabled: keys.length > 0,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('medication_visual_references')
        .select('*')
        .in('drug_key', keys)

      if (error) throw error

      return (data ?? []).reduce<Record<string, MedicationVisualReference>>((acc, ref) => {
        acc[ref.drug_key] = ref as MedicationVisualReference
        return acc
      }, {})
    },
  })
}
