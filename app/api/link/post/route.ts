import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function POST(req: Request) {
  const body = await req.json();
  const { userID, url, title, description, mediaType, collection, tags } = body;

  try {
    const newLink = await prisma.link.create({
      data: {
        userID: Number(userID),
        url,
        title,
        description,
        mediaType,
        collection,
        tags: tags ? JSON.parse(tags) : [],
      },
    });
    return NextResponse.json(newLink, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error creating link' }, { status: 500 });
  }
}
