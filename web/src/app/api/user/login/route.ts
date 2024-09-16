import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const clientRequestBody = await request.text()
  const backendResponse = await fetch(`${process.env.BACKEND_HOST}/api/user/login`, {
    method: "POST",
    body: clientRequestBody,
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if (backendResponse.status === 401) {
    return new NextResponse(null, { status: 401 })
  }

  const backendResponseBody = await backendResponse.json()

  const clientResponse = new NextResponse(null, { status: 200 })
  clientResponse.cookies.set('token', backendResponseBody.token, {
    httpOnly: true,
    secure: true,
    path: '/',
    sameSite: 'strict'
  })

  return clientResponse
}