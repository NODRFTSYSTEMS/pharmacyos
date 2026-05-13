import { useQuery } from '@tanstack/react-query'
import { supabase } from '../lib/supabase'
import type { Patient, Prescription, Product, RetailTransaction } from '../types/database'

export interface SearchResult {
  id: string
  type: 'patient' | 'prescription' | 'product' | 'transaction'
  title: string
  subtitle: string
  href: string
}

async function fetchSearchResults(query: string): Promise<SearchResult[]> {
  const pattern = `%${query}%`

  const [patientsRes, prescriptionsRes, productsRes, transactionsRes] = await Promise.all([
    supabase
      .from('patients')
      .select('id, first_name, last_name, phone')
      .or(`first_name.ilike.${pattern},last_name.ilike.${pattern}`)
      .limit(4),

    supabase
      .from('prescriptions')
      .select('id, drug_name, ref_number, patient_name')
      .or(`patient_name.ilike.${pattern},drug_name.ilike.${pattern},ref_number.ilike.${pattern}`)
      .limit(4),

    supabase
      .from('products')
      .select('id, name, barcode, stock_qty')
      .or(`name.ilike.${pattern},barcode.ilike.${pattern}`)
      .limit(4),

    supabase
      .from('retail_transactions')
      .select('id, ref_number, total, payment_method')
      .ilike('ref_number', pattern)
      .limit(4),
  ])

  const patients = (patientsRes.data ?? []) as Pick<Patient, 'id' | 'first_name' | 'last_name' | 'phone'>[]
  const prescriptions = (prescriptionsRes.data ?? []) as Pick<Prescription, 'id' | 'drug_name' | 'ref_number' | 'patient_name'>[]
  const products = (productsRes.data ?? []) as Pick<Product, 'id' | 'name' | 'barcode' | 'stock_qty'>[]
  const transactions = (transactionsRes.data ?? []) as Pick<RetailTransaction, 'id' | 'ref_number' | 'total' | 'payment_method'>[]

  const results: SearchResult[] = [
    ...patients.map((row): SearchResult => ({
      id: row.id,
      type: 'patient',
      title: `${row.first_name} ${row.last_name}`,
      subtitle: `Patient · ${row.phone ?? '—'}`,
      href: '/patients',
    })),

    ...prescriptions.map((row): SearchResult => ({
      id: row.id,
      type: 'prescription',
      title: row.drug_name,
      subtitle: `Rx ${row.ref_number} · ${row.patient_name}`,
      href: '/prescriptions',
    })),

    ...products.map((row): SearchResult => ({
      id: row.id,
      type: 'product',
      title: row.name,
      subtitle: `Stock: ${row.stock_qty} · ${row.barcode ?? '—'}`,
      href: '/pos/products',
    })),

    ...transactions.map((row): SearchResult => ({
      id: row.id,
      type: 'transaction',
      title: `Transaction ${row.ref_number}`,
      subtitle: `JMD ${row.total.toFixed(2)} · ${row.payment_method}`,
      href: '/pos/transactions',
    })),
  ]

  return results
}

export function useGlobalSearch(query: string) {
  return useQuery<SearchResult[]>({
    queryKey: ['global-search', query],
    queryFn: () => fetchSearchResults(query),
    enabled: query.length >= 2,
    staleTime: 10_000,
  })
}
