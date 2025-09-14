// src/app/dashboard/page.js
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import LogoutButton from '@/components/LogoutButton'

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies })
  
  // Get the user session
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  // Fetch reports submitted by the current user
  const { data: reports, error } = await supabase
    .from('reports')
    .select('*')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false }) // Show newest first

  if (error) {
    console.error('Error fetching reports:', error)
  }

  return (
    <div className="w-full max-w-4xl mx-auto my-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">My Reports</h1>
          <p className="text-gray-500">Logged in as: {session.user.email}</p>
        </div>
        <LogoutButton />
      </div>

      <Link href="/submit-report" className="inline-block bg-blue-500 text-white rounded px-4 py-2 mb-6 hover:bg-blue-600">
        Submit a New Report
      </Link>

      <div className="space-y-4">
        {reports && reports.length > 0 ? (
          reports.map((report) => (
            <div key={report.id} className="p-4 border rounded-lg shadow-sm bg-white">
              <div className="flex justify-between">
                <h2 className="text-xl font-semibold">{report.title}</h2>
                <span className={`px-2 py-1 text-sm font-medium rounded-full ${
                  report.status === 'Submitted' ? 'bg-yellow-200 text-yellow-800' :
                  report.status === 'In Progress' ? 'bg-blue-200 text-blue-800' :
                  'bg-green-200 text-green-800'
                }`}>
                  {report.status}
                </span>
              </div>
              <p className="text-gray-600 mt-2">{report.description}</p>
              <p className="text-sm text-gray-500 mt-2">Category: {report.category}</p>
            </div>
          ))
        ) : (
          <p>You haven't submitted any reports yet.</p>
        )}
      </div>
    </div>
  )
}