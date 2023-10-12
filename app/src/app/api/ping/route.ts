import { withApiAuthRequired } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';
import { apiHost } from '../base';

export const GET = withApiAuthRequired(async function shows(req) {
  try {
    const res = new NextResponse();
    const response = await fetch(`${apiHost}/`, {});
    const shows = await response.json();

    return NextResponse.json(shows, res);
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: error.status || 500 });
    } else {
      return NextResponse.json({ error: 'Unknown error' }, { status: 500 });
    }
  }
});
