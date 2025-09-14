// src/app/admin/dashboard/page.js
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import StatusUpdater from './StatusUpdater'

export default async function AdminDashboard() {
  const supabase = createServerComponentClient({ cookies })

  // Check for an active session
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    redirect('/')
  }

  // Fetch the user's profile to check their role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single()

  // Redirect if they are not an admin
  if (profile?.role !== 'admin') {
    redirect('/')
  }

  // Fetch all reports for the admin view
  const { data: reports } = await supabase
    .from('reports')
    .select('*')
    .order('created_at', { ascending: false })

  // Define the Server Action to update status
  async function updateReportStatus(id, newStatus) {
    'use server'
    const supabase = createServerComponentClient({ cookies })
    const { error } = await supabase
      .from('reports')
      .update({ status: newStatus })
      .eq('id', id)
    
    if (error) console.error('Error updating status:', error)
    
    revalidatePath('/admin/dashboard')
  }

  return (
    <div className="w-full max-w-6xl mx-auto my-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-2 px-4 border text-left">Title</th>
              <th className="py-2 px-4 border text-left">Category</th>
              <th className="py-2 px-4 border text-left">Submitted On</th>
              <th className="py-2 px-4 border text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {reports?.map((report) => (
              <tr key={report.id}>
                <td className="py-2 px-4 border">{report.title}</td>
                <td className="py-2 px-4 border">{report.category}</td>
                <td className="py-2 px-4 border">{new Date(report.created_at).toLocaleString()}</td>
                <td className="py-2 px-4 border">
                  <StatusUpdater report={report} updateAction={updateReportStatus} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}