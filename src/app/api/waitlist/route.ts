import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const WAITLIST_FILE = path.join(process.cwd(), 'data', 'waitlist.json')

// Ensure the data directory exists
try {
  if (!fs.existsSync(path.join(process.cwd(), 'data'))) {
    fs.mkdirSync(path.join(process.cwd(), 'data'), { recursive: true })
  }

  // Create waitlist.json if it doesn't exist
  if (!fs.existsSync(WAITLIST_FILE)) {
    fs.writeFileSync(WAITLIST_FILE, JSON.stringify({ emails: [] }, null, 2))
  }
} catch (error) {
  console.error('Error initializing waitlist file:', error)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const email = body?.email

    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Ensure waitlist file exists
    if (!fs.existsSync(WAITLIST_FILE)) {
      fs.writeFileSync(WAITLIST_FILE, JSON.stringify({ emails: [] }, null, 2))
    }

    // Read existing waitlist
    let waitlist
    try {
      const fileContent = fs.readFileSync(WAITLIST_FILE, 'utf-8')
      waitlist = JSON.parse(fileContent)
      if (!waitlist || !Array.isArray(waitlist.emails)) {
        waitlist = { emails: [] }
      }
    } catch (error) {
      console.error('Error reading waitlist:', error)
      waitlist = { emails: [] }
    }

    // Check if email already exists
    if (waitlist.emails.includes(email)) {
      return NextResponse.json(
        { error: 'This email is already on the waitlist!' },
        { status: 409 }
      )
    }

    // Add new email
    waitlist.emails.push(email)

    // Save updated waitlist
    try {
      fs.writeFileSync(WAITLIST_FILE, JSON.stringify(waitlist, null, 2))
    } catch (error) {
      console.error('Error saving waitlist:', error)
      return NextResponse.json(
        { error: 'Failed to save to waitlist' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'Successfully joined the waitlist!' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Waitlist error:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}
