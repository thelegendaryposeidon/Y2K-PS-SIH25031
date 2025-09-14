// src/app/login/page.js
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleSignIn = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (!error) {
      router.push('/') // Redirect to home page after login
      router.refresh() // Refresh the page to update server components
    } else {
      console.error(error)
      // You can add user-facing error handling here
    }
  }

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
      <input
        name="email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        placeholder="you@example.com"
        className="mb-4 p-2 border rounded"
      />
      <input
        type="password"
        name="password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        placeholder="••••••••"
        className="mb-4 p-2 border rounded"
      />
      <button onClick={handleSignIn} className="bg-green-500 rounded px-4 py-2 text-white mb-2">
        Sign In
      </button>
    </div>
  )
}