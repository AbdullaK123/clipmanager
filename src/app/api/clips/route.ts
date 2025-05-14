import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
    const requestBody = await request.json();
    console.log('The request body is: \n', JSON.stringify(requestBody, null, 2))
    return NextResponse.json({
        'message': 'Hello from POST /clips!'
    })
}