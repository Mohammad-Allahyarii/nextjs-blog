'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/src/lib/auth-client'

const AuthPanel = () => {
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')


  async function run(action: () => Promise<{ error: { message?: string } | null }>, ok: string) {
    const { error } = await action()
    setMessage(error ? `Error: ${error.message}` : ok)
    router.refresh() // سرور کامپوننت‌ها را دوباره رندر کند
  }

  return (
    <div style={{ display: 'grid', gap: 8, maxWidth: 320 }}>
      <p>Client session: {isPending ? 'loading…' : session?.user.email ?? 'none'}</p>
      <input className='border border-primary' placeholder="name" value={name} onChange={(e) => setName(e.target.value)} />
      <input className='border border-primary' placeholder="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input className='border border-primary' placeholder="password (min 8)" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button className="border border-primary" onClick={() => run(() => authClient.signUp.email({ name, email, password }), 'Signed up')}>Sign up</button>
      <button className="border border-primary" onClick={() => run(() => authClient.signIn.email({ email, password }), 'Signed in')}>Sign in</button>
      <button className="border border-primary" onClick={() => run(() => authClient.signOut(), 'Signed out')}>Sign out</button>
      <p>{message}</p>
    </div>
  )
}

export default AuthPanel;