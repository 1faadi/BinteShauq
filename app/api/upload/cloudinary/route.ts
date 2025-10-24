import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Upload to Cloudinary using signed upload
    const cloudinaryFormData = new FormData()
    cloudinaryFormData.append('file', file)
    cloudinaryFormData.append('api_key', process.env.CLOUDINARY_API_KEY || '')
    cloudinaryFormData.append('folder', 'binteshauq/products')
    cloudinaryFormData.append('timestamp', Math.round(new Date().getTime() / 1000).toString())

    // Generate signature for signed upload
    const timestamp = Math.round(new Date().getTime() / 1000)
    const signature = require('crypto')
      .createHash('sha1')
      .update(`folder=binteshauq/products&timestamp=${timestamp}${process.env.CLOUDINARY_API_SECRET || ''}`)
      .digest('hex')
    
    cloudinaryFormData.append('signature', signature)

    console.log('Cloudinary config:', {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      fileName: file.name,
      fileSize: file.size
    })

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: cloudinaryFormData,
      }
    )

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Cloudinary API error:', response.status, errorText)
      throw new Error(`Failed to upload to Cloudinary: ${response.status} - ${errorText}`)
    }

    const data = await response.json()
    
    return NextResponse.json({ 
      success: true, 
      url: data.secure_url,
      publicId: data.public_id 
    })
  } catch (error) {
    console.error("Cloudinary upload error:", error)
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    )
  }
}
