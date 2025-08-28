import { NextResponse } from 'next/server'

export function GET() {
  return NextResponse.redirect(new URL('/dashboard', process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'))
}

export function POST() {
  return NextResponse.redirect(new URL('/dashboard', process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'))
}
