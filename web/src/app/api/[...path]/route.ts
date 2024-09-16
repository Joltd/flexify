import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  return exchange(request)
}

export async function POST(request: NextRequest) {
  return exchange(request)
}

export async function PUT(request: NextRequest) {
  return exchange(request)
}

export async function PATCH(request: NextRequest) {
  return exchange(request)
}

export async function DELETE(request: NextRequest) {
  return exchange(request)
}

async function exchange(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  if (!token) {
    return NextResponse.redirect('/login')
  }

  const init: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }
  if (request.method !== 'GET') {
    init.method = request.method
    init.body = await request.text()
  }
  try {
    return await fetch(`${process.env.BACKEND_HOST}${request.nextUrl.pathname}`, init)
  } catch (e) {
    console.log(e)
    return NextResponse.json({
      detail: 'Service Unavailable'
    }, { status: 503 })
  }
}