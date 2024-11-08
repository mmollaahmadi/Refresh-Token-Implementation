import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const { refreshToken } = await request.json();

    if (refreshToken === 'fakeRefreshToken123') {
        const newTokens = {
            accessToken: 'newFakeAccessToken456',
            refreshToken: 'newFakeRefreshToken456',
        };
        return NextResponse.json(newTokens);
    } else {
        return new NextResponse('Forbidden', { status: 403 });
    }
}
