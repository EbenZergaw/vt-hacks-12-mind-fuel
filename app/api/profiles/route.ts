import { NextResponse } from 'next/server';
import prisma from '../../../lib/prisma'; // Adjust path to your prisma setup

export async function GET(req: Request) {
  try {
    const profiles = await prisma.profile.findMany({
      select: {
        id: true,
        username: true,
        avatar: true,
        bio: true,
      },
    });
    return NextResponse.json(profiles, { status: 200 });
  } catch (error) {
    console.error('Error fetching profiles:', error);
    return NextResponse.json({ error: 'Error fetching profiles' }, { status: 500 });
  }
}
