import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/lib/auth';

export async function GET(request: NextRequest) {

    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
        return NextResponse.json(
            {'message': 'User not authenticated'}, 
            {status: 401}
        );
    }

    try {
        const clips = await db.knowledgeClip.findMany({
            'where': {
                'userId': session?.user.id
            },
            'orderBy': {
                'createdAt': 'desc'
            }
        });
        return NextResponse.json(
            {'clips': clips}, 
            {status: 200}
        );
    } catch (err) {
        return NextResponse.json(
            {'message': `Failed to fetch clips: ${err instanceof Error ? err.message : String(err)}`}, 
            {status: 500}
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        // Get the session using the correct import and parameters
        const session = await getServerSession(authOptions);
        
        console.log("Session in POST /api/clips:", JSON.stringify(session, null, 2));
        
        if (!session || !session.user) {
            return NextResponse.json(
                {'message': 'User not authenticated'}, 
                {status: 401}
            );
        }
        
        if (!session.user.id) {
            return NextResponse.json(
                {'message': 'User ID not found in session'}, 
                {status: 400}
            );
        }

        const requestBody = await request.json();
        const createdClip = await db.knowledgeClip.create({
            'data': {
                'title': requestBody.title,
                'content': requestBody.content,
                'tags': requestBody.tags,
                'userId': session.user.id
            }
        });
        
        return NextResponse.json(
            {'clip': createdClip}, 
            {status: 201}
        );
    } catch (err) {
        console.error("Error in POST /api/clips:", err);
        return NextResponse.json(
            {'message': `Failed to add clip to clip store: ${err instanceof Error ? err.message : String(err)}`}, 
            {status: 500}
        );
    }
}