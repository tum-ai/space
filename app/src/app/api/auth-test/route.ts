import { getAccessToken, withApiAuthRequired } from '@auth0/nextjs-auth0';
import { NextResponse } from 'next/server';
import { apiHost } from '../base';

export const GET = withApiAuthRequired(async function shows(req) {
  try {
    const res = new NextResponse();
    const { accessToken } = await getAccessToken(req, res)
      // {
      // scopes: ['auth:test'],
      // scopes: ['profile'],
      // authorizationParams: {
        // audience: 'https://api.space.staging.tum-ai.com/auth',
        // audience: 'https://api/tv-shows',
        // scope: 'auth:test',
        // scope: 'profile',
        // scope: 'read:shows',
      // },
    // }
    // );
    const response = await fetch(`${apiHost}/auth-test`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return NextResponse.json(accessToken, await response.json());
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: error.status || 500 });
  }
});
