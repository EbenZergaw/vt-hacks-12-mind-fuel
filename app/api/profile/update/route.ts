import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function POST(req: Request) {
  const body = await req.json();
  const { id, username, avatar, bio, socials, collection } = body;

  try {
    // Ensure socials is an array or empty if not provided
    const socialsArray = socials && Array.isArray(socials) ? socials : [];

    // Fetch the current profile to ensure we are appending the collection
    const existingProfile = await prisma.profile.findUnique({
      where: { id },
    });

    if (!existingProfile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Append the new collection to the existing ones (if any)
    const updatedCollections = [...existingProfile.collections, collection];

    const updatedProfile = await prisma.profile.update({
      where: { id }, // Use id as a string
      data: {
        username,
        avatar,
        bio,
        socials: socialsArray,
        collections: updatedCollections, // Append new collection
      },
    });

    return NextResponse.json(updatedProfile, { status: 200 });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Unable to update profile' }, { status: 500 });
  }
}
