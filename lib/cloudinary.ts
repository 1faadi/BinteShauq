// Cloudinary configuration and utilities
// Add your Cloudinary credentials to environment variables

export const cloudinaryConfig = {
  cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  apiKey: process.env.CLOUDINARY_API_KEY,
  apiSecret: process.env.CLOUDINARY_API_SECRET,
}

// Utility function to upload image to Cloudinary
export async function uploadToCloudinary(file: File | Buffer, folder?: string): Promise<string> {
  const formData = new FormData()
  
  if (file instanceof File) {
    formData.append('file', file)
  } else {
    formData.append('file', new Blob([file]), 'image.jpg')
  }
  
  formData.append('upload_preset', process.env.CLOUDINARY_UPLOAD_PRESET || 'default')
  
  if (folder) {
    formData.append('folder', folder)
  }

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    )

    if (!response.ok) {
      throw new Error('Failed to upload image to Cloudinary')
    }

    const data = await response.json()
    return data.secure_url
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    throw error
  }
}

// Utility function to delete image from Cloudinary
export async function deleteFromCloudinary(publicId: string): Promise<boolean> {
  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/destroy`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          public_id: publicId,
          signature: '', // You might need to generate a signature for security
        }),
      }
    )

    return response.ok
  } catch (error) {
    console.error('Cloudinary delete error:', error)
    return false
  }
}

// Extract public ID from Cloudinary URL
export function extractPublicId(url: string): string | null {
  const match = url.match(/\/v\d+\/(.+)\./)
  return match ? match[1] : null
}
