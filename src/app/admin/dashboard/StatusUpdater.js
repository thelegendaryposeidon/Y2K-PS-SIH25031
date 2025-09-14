// src/app/admin/dashboard/StatusUpdater.js
'use client'

import { useTransition } from 'react'

export default function StatusUpdater({ report, updateAction }) {
  let [isPending, startTransition] = useTransition()

  const handleStatusChange = (e) => {
    startTransition(async () => {
      await updateAction(report.id, e.target.value)
    })
  }

  return (
    <select
      defaultValue={report.status}
      onChange={handleStatusChange}
      disabled={isPending}
      className={`p-1 border rounded ${isPending ? 'opacity-50' : ''}`}
    >
      <option value="Submitted">Submitted</option>
      <option value="In Progress">In Progress</option>
      <option value="Resolved">Resolved</option>
    </select>
  )
}