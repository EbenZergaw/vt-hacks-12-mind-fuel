import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function POST(req: Request) {
  try {
    // Parse the request body
    const { userID, url, title, description, mediaType, collection, tags } = await req.json();

    // Create a new link in the database
    const newLink = await prisma.link.create({
      data: {
        userID,
        url,
        title,
        description,
        mediaType,
        collection,
        tags: tags || [],  // If tags is an array, no need to parse it again
      },
    });

    // Update the user's profile with the new link
    await prisma.profile.update({
      where: { id: userID },
      data: {
        links: {
          connect: { id: newLink.id },
        },
      },
    });

    // Return the created link in the response
    return NextResponse.json({ link: newLink }, { status: 201 });
  } catch (error) {
    console.error('Error creating link:', error);
    return NextResponse.json({ error: 'Error creating link' }, { status: 500 });
  }
}
