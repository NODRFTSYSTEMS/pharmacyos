import { useNavigate } from 'react-router'
import { Files, Clock, Phone } from '@phosphor-icons/react'
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../../lib/supabase'
import { usePageTitle } from '../../hooks/usePageTitle'

/**
 * Pharmacy Closed Page
 * Displayed when a non-ADMIN/MANAGER staff member tries to access the system
 * while the pharmacy is marked closed (operating_hours.is_currently_open = false).
 *
 * ADMIN and MANAGER see this banner inline instead of the full page.
 */

export function PharmacyClosed() {
  usePageTitle('Pharmacy Closed')
  const navigate = useNavigate()

  // Fetch pharmacy hours and contact info from settings
  const { data: hours } = useQuery<{ operatingHours: string; adminPhone: string }>({
    queryKey: ['pharmacy-hours'],
    queryFn: async () => {
      const [hoursRes, phoneRes] = await Promise.all([
        supabase
          .from('pharmacy_settings')
          .select('value')
          .eq('key', 'pharmacy_operating_hours')
          .maybeSingle(),
        supabase
          .from('pharmacy_settings')
          .select('value')
          .eq('key', 'admin_phone')
          .maybeSingle(),
      ])

      return {
        operatingHours: hoursRes.data?.value || 'See staff schedule',
        adminPhone: phoneRes.data?.value || '',
      }
    },
  })

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo mark */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <Files size={22} weight="duotone" className="text-blue-600" aria-hidden="true" />
          <span className="font-bold text-gray-800 text-base">PharmacyOS</span>
        </div>

        <div className="card p-10 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center">
              <Clock size={32} weight="duotone" className="text-amber-600" aria-hidden="true" />
            </div>
          </div>

          <h1 className="text-xl font-bold text-gray-900 mb-2">Pharmacy Closed</h1>
          <p className="text-sm text-gray-600 mb-4">
            The pharmacy is currently closed. Please try again during operating hours.
          </p>

          {hours?.operatingHours && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-xs text-blue-900 font-semibold mb-1">Operating Hours</p>
              <p className="text-sm text-blue-800 font-mono whitespace-pre-line">{hours.operatingHours}</p>
            </div>
          )}

          {hours?.adminPhone && (
            <p className="text-sm text-gray-600 mb-6 flex items-center justify-center gap-2">
              <Phone size={14} aria-hidden="true" />
              <span>Contact manager: <span className="font-mono font-semibold">{hours.adminPhone}</span></span>
            </p>
          )}

          <div className="flex flex-col gap-2">
            <button
              onClick={() => navigate('/login')}
              className="btn btn-primary w-full"
            >
              Sign Out
            </button>
            <button
              onClick={() => window.location.reload()}
              className="btn btn-ghost w-full"
            >
              Refresh Status
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-gray-500 mt-4">
          PharmacyOS · System Access Restricted
        </p>
      </div>
    </div>
  )
}

export default PharmacyClosed
