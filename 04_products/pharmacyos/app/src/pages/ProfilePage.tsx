import { useState } from 'react'
import { PageHeader } from '@/components/PageHeader'
import { FormField } from '@/components/Input'
import { Input } from '@/components/Input'
import { Button } from '@/components/Button'
import { StatusPill } from '@/components/StatusPill'
import { ShieldCheck, ShieldWarning } from '@phosphor-icons/react'

export function ProfilePage() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const twoFaEnabled = true
  const passwordMatch = confirmPassword === newPassword
  const canChangePassword = currentPassword && newPassword && confirmPassword && passwordMatch

  return (
    <div className="flex-1 p-6 space-y-6 max-w-3xl">
      <PageHeader title="My Profile" />

      {/* Identity */}
      <section className="bg-bg-surface rounded-card shadow-card border border-border p-6 space-y-4">
        <h2 className="type-card-title text-text-primary">Identity</h2>
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Full name">
            {(props) => (
              <Input {...props} value="Dr. Kezia Powell" readOnly className="bg-bg-subtle" />
            )}
          </FormField>
          <FormField label="Email">
            {(props) => (
              <Input {...props} value="kpowell@winchester.com.jm" readOnly className="bg-bg-subtle" />
            )}
          </FormField>
        </div>
        <div>
          <p className="type-label text-text-secondary mb-1">Role</p>
          <StatusPill variant="info">Pharmacist</StatusPill>
        </div>
      </section>

      {/* Change Password */}
      <section className="bg-bg-surface rounded-card shadow-card border border-border p-6 space-y-4">
        <h2 className="type-card-title text-text-primary">Change Password</h2>
        <FormField label="Current password">
          {(props) => (
            <Input {...props} type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
          )}
        </FormField>
        <FormField label="New password">
          {(props) => (
            <Input {...props} type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          )}
        </FormField>
        <FormField label="Confirm new password" error={confirmPassword && !passwordMatch ? 'Passwords do not match' : undefined}>
          {(props) => (
            <Input {...props} type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
          )}
        </FormField>
        <div className="pt-2">
          <Button variant="primary" disabled={!canChangePassword}>Update Password</Button>
        </div>
      </section>

      {/* 2FA */}
      <section className="bg-bg-surface rounded-card shadow-card border border-border p-6 space-y-4">
        <h2 className="type-card-title text-text-primary">Two-Factor Authentication</h2>
        <div className="flex items-center gap-3">
          {twoFaEnabled ? (
            <>
              <ShieldCheck size={24} className="text-rx-filled-fg" />
              <div>
                <p className="type-body-sm font-medium text-text-primary">2FA is enabled</p>
                <p className="type-body-xs text-text-secondary">Your account is protected with an authenticator app.</p>
              </div>
            </>
          ) : (
            <>
              <ShieldWarning size={24} className="text-warning" />
              <div>
                <p className="type-body-sm font-medium text-text-primary">2FA is not enabled</p>
                <p className="type-body-xs text-text-secondary">Enable 2FA to protect your account.</p>
              </div>
            </>
          )}
        </div>
        <div className="flex gap-2 pt-2">
          <Button variant="secondary">View Backup Codes</Button>
          <Button variant="destructive">Reset 2FA</Button>
        </div>
      </section>
    </div>
  )
}

export default ProfilePage
