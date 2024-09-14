import { NextResponse } from 'next/server';
import prisma from '../../../../lib/prisma';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);

  try {
    const link = await prisma.link.findUnique({
      where: { id },
    });

    if (link) {
      return NextResponse.json(link, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Link not found' }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching link' }, { status: 500 });
  }
}
