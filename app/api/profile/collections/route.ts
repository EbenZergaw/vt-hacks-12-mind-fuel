import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function POST(req: Request) {
  try {
    // Get the user's ID from the request body
    const { userId } = await req.json(); 

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Strip the "user_" prefix if necessary
    const databaseUserID = userId.replace("user_", "");

    // Fetch the collections for the user
    const userProfile = await prisma.profile.findUnique({
      where: { id: databaseUserID },
      select: {
        collections: true, // Only fetch the collections
      },
    });

    if (!userProfile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Return the user's collections
    return NextResponse.json({ collections: userProfile.collections }, { status: 200 });
  } catch (error) {
    console.error('Error fetching collections:', error);
    return NextResponse.json({ error: 'Failed to fetch collections' }, { status: 500 });
  }
}
