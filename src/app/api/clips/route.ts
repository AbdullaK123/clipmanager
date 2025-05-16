import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/lib/prisma'

export async function GET(request: NextRequest) {
    try {
        const clips = await db.knowledgeClip.findMany({
            'orderBy': {
                'createdAt': 'desc'
            }
        })
        return NextResponse.json(
            {'clips': clips}, 
            {'status': 200}
        )
    } catch (err) {
        return NextResponse.json(
            {'message': `Failed to fetch clips: ${err instanceof Error ? err.message : String(err)}`}, 
            {'status': 500}
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const requestBody = await request.json();
        const createdClip = await db.knowledgeClip.create({
            'data': {
                'title': requestBody.title,
                'content': requestBody.content,
                'tags': requestBody.tags,
            }
        })
        return NextResponse.json(
            {'clip': createdClip}, 
            {'status': 201}
        )
    } catch (err) {
        return NextResponse.json(
            {'message': `Failed to add clip to clip store: ${err instanceof Error ? err.message : String(err)}`}, 
            {'status': 500}
        )
    }
}