// src/app/page.js
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import MapboxMap from '@/components/Map'

export default async function HomePage() {
  const supabase = createServerComponentClient({ cookies })
  
  const { data: reports } = await supabase
    .from('reports')
    .select('id, title, latitude, longitude, status')

  return (
    <main>
      <MapboxMap reports={reports} />
    </main>
  )
}