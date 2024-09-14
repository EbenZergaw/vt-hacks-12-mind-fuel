import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);

  try {
    const profile = await prisma.profile.findUnique({
      where: { id },
      include: {
        links: true,
      },
    });

    if (profile) {
      return NextResponse.json(profile, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Profile not found' }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching profile' }, { status: 500 });
  }
}
