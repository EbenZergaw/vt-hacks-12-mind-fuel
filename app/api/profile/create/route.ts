import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function POST(req: Request) {
  const body = await req.json();
  const { username, avatar, bio, socials, collections } = body;

  try {
    const newProfile = await prisma.profile.create({
      data: {
        username,
        avatar,
        bio,
        socials: socials ? JSON.parse(socials) : [],
        collections,
      },
    });
    return NextResponse.json(newProfile, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Unable to create profile' }, { status: 500 });
  }
}
