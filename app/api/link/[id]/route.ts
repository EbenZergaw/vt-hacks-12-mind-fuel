import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const userID = params.id;  // UserID is a string, not a number

  try {
    // Fetch all links associated with the user's ID
    const links = await prisma.link.findMany({
      where: { userID },
    });

    if (links.length > 0) {
      return NextResponse.json(links, { status: 200 });
    } else {
      return NextResponse.json({ message: 'No links found for this user' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error fetching links:', error);
    return NextResponse.json({ error: 'Error fetching links' }, { status: 500 });
  }
}
