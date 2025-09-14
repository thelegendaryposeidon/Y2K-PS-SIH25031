// src/components/LogoutButton.js
'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

export default function LogoutButton() {
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  return (
    <button
      className="bg-red-500 rounded px-4 py-2 text-white"
      onClick={handleSignOut}
    >
      Logout
    </button>
  )
}