// src/app/signup/page.js
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleSignUp = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    })

    if (!error) {
      // You can show a message to the user to check their email
      alert('Check your email to confirm your account!')
      router.push('/')
    } else {
      console.error(error)
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
      <button onClick={handleSignUp} className="bg-blue-500 rounded px-4 py-2 text-white mb-2">
        Sign Up
      </button>
    </div>
  )
}