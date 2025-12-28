import { NextResponse } from 'next/server';

const contentDatabase: any[] = [];

export async function GET() {
  return NextResponse.json({ ideas: contentDatabase });
}
