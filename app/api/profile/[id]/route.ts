import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const id = params.id; // No need to convert it to a number

  try {
    const profile = await prisma.profile.findUnique({
      where: { id }, // Use the id directly as a string
      include: {
        links: true, // Include associated links if necessary
      },
    });

    if (!profile) {
      return NextResponse.json({ message: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json(profile, { status: 200 });
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
