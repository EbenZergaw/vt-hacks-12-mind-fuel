import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function PUT(req: Request) {
  const body = await req.json();
  const { id, username, avatar, bio, socials, collections } = body;

  try {
    const updatedProfile = await prisma.profile.update({
      where: { id: Number(id) },
      data: {
        username,
        avatar,
        bio,
        socials: socials ? JSON.parse(socials) : [],
        collections,
      },
    });
    return NextResponse.json(updatedProfile, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Unable to update profile' }, { status: 500 });
  }
}
