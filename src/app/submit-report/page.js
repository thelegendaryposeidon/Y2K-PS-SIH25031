// src/app/submit-report/page.js
'use client'

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

// This is a protected route. We'll add server-side protection later.
export default function SubmitReport() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('Pothole') // Default category
  const [file, setFile] = useState(null)
  const [location, setLocation] = useState(null)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  
  const supabase = createClientComponentClient()
  const router = useRouter()

  // Fetch the current user and their location when the component mounts
  useEffect(() => {
    const getUserAndLocation = async () => {
      // Get User
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
      } else {
        router.push('/login') // Redirect if not logged in
        return
      }

      // Get Location
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
          setLoading(false)
        }, (error) => {
          console.error("Error getting location: ", error)
          // Handle location error (e.g., user denies permission)
          alert("Could not get your location. Please enable location services.")
          setLoading(false)
        })
      } else {
        alert("Geolocation is not supported by this browser.")
        setLoading(false)
      }
    }
    
    getUserAndLocation()
  }, [supabase, router])

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!title || !location || !user) {
      alert('Title and location are required.')
      return
    }

    let photoUrl = null

    // 1. Upload the photo if one was selected
    if (file) {
      const filePath = `${user.id}/${Date.now()}_${file.name}`
      const { error: uploadError } = await supabase.storage
        .from('report-photos')
        .upload(filePath, file)

      if (uploadError) {
        console.error('Error uploading photo:', uploadError)
        alert('Failed to upload photo.')
        return
      }

      // 2. Get the public URL of the uploaded photo
      const { data } = supabase.storage
        .from('report-photos')
        .getPublicUrl(filePath)
      photoUrl = data.publicUrl
    }

    // 3. Insert the new report into the database
    const { error: insertError } = await supabase.from('reports').insert({
      title,
      description,
      category,
      photo_url: photoUrl,
      latitude: location.latitude,
      longitude: location.longitude,
      user_id: user.id,
      // status will use the 'Submitted' default value
    })

    if (insertError) {
      console.error('Error creating report:', insertError)
      alert('Failed to submit report.')
    } else {
      alert('Report submitted successfully!')
      router.push('/dashboard') // Redirect to dashboard after submission
    }
  }
  
  if (loading) {
    return <div>Loading and getting your location...</div>
  }

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 mx-auto">
      <h1 className="text-2xl font-bold mb-4">Submit a New Report</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Report Title (e.g., Deep Pothole on Main St)"
          required
          className="p-2 border rounded"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)"
          className="p-2 border rounded"
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="p-2 border rounded">
          <option value="Pothole">Pothole</option>
          <option value="Streetlight Out">Streetlight Out</option>
          <option value="Trash Overflow">Trash Overflow</option>
          <option value="Graffiti">Graffiti</option>
          <option value="Other">Other</option>
        </select>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="p-2 border rounded"
        />
        <p className="text-sm text-gray-600">
          Location Captured: {location ? `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}` : 'Getting location...'}
        </p>
        <button type="submit" className="bg-blue-500 rounded px-4 py-2 text-white">
          Submit Report
        </button>
      </form>
    </div>
  )
}