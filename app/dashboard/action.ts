'use server'

import { revalidatePath } from 'next/cache'

export async function addLink(formData: FormData) {
  const userID = formData.get('userID') as string
  const url = formData.get('url') as string
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const mediaType = formData.get('mediaType') as string
  const collection = formData.get('collection') as string
  const tags = JSON.parse(formData.get('tags') as string)

  try {
    const response = await fetch(`${process.env.API_URL}/api/link/post`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userID,
        url,
        title,
        description,
        mediaType,
        collection,
        tags,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to create link')
    }

    // Revalidate the dashboard page
    revalidatePath('/dashboard')

    return { success: true }
  } catch (error) {
    console.error('Error creating link:', error)
    return { success: false, error: 'Failed to create link' }
  }
}
