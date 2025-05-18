
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/app/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { handler } from '@/app/api/auth/[...nextauth]/route';

export async function PUT(
    request: NextRequest,
    { params } : { params: { id: string }}
) {
    // Get user session
    const session = await getServerSession(handler);
    
    if (!session || !session.user) {
        return NextResponse.json(
            {"message": "Unauthorized! You must be logged in to update clips."},
            {status: 401}
        );
    }

    try { 
        const idToUpdate = params.id;
        if (!idToUpdate) {
            return NextResponse.json(
                {"message": "No id provided"},
                {status: 400}
            )
        }
        
        // Check if clip exists and belongs to the user
        const existingClip = await db.knowledgeClip.findUnique({
            where: {
                id: idToUpdate
            }
        });
        
        if (!existingClip) {
            return NextResponse.json(
                {"message": "Clip not found"},
                {status: 404}
            );
        }
        
        if (existingClip.userId !== session.user.id) {
            return NextResponse.json(
                {"message": "Unauthorized! You can only update your own clips."},
                {status: 403}
            );
        }
    
        const updatedData = await request.json();
    
        const updatedClip = await db.knowledgeClip.update({
            where: {
                id: idToUpdate
            },
            data: updatedData
        })
    
        return NextResponse.json(
            {"clip": updatedClip},
            {status: 200}
        )
    } catch(err) {
        console.error("[API PUT] Error:", err);
        if (err instanceof SyntaxError) {
            return NextResponse.json({ message: "Invalid JSON in request body" }, { status: 400 });
        }
        if (err && typeof err === 'object' && 'code' in err && err.code === 'P2025') {
            return NextResponse.json({ message: "No clip found with such an id to update" }, { status: 404 });
        }
        return NextResponse.json({ message: "Failed to update clip" }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string }}
) {
    // Get user session
    const session = await getServerSession(handler);
    
    if (!session || !session.user) {
        return NextResponse.json(
            {"message": "Unauthorized! You must be logged in to delete clips."},
            {status: 401}
        );
    }
    
    try {
        const idToDelete = params.id;
        if (!idToDelete) {
            return NextResponse.json(
                {"message": "No id provided"},
                {status: 400}
            )
        }
        
        // Check if clip exists and belongs to the user
        const existingClip = await db.knowledgeClip.findUnique({
            where: {
                id: idToDelete
            }
        });
        
        if (!existingClip) {
            return NextResponse.json(
                {"message": "Clip not found"},
                {status: 404}
            );
        }
        
        if (existingClip.userId !== session.user.id) {
            return NextResponse.json(
                {"message": "Unauthorized! You can only delete your own clips."},
                {status: 403}
            );
        }
    
        const deletedClip = await db.knowledgeClip.delete({
            where: {
                id: idToDelete
            }
        })
    
        return NextResponse.json(
            {"clip": deletedClip},
            {status: 200}
        )
    } catch (err) {
        console.error("[API DELETE] Error:", err);
        if (err && typeof err === 'object' && 'code' in err && err.code === 'P2025') {
            return NextResponse.json({ message: "No clip found with such an id to delete" }, { status: 404 });
        }
        return NextResponse.json({ message: "Failed to delete clip" }, { status: 500 });
    }
}