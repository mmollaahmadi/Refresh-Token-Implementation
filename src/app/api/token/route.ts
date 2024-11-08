import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const { username, password } = await request.json();

    if (username === 'user' && password === 'password') {
        const tokens = {
            accessToken: 'fakeAccessToken123',
            refreshToken: 'fakeRefreshToken123',
        };
        return NextResponse.json(tokens);
    } else {
        return new NextResponse('Unauthorized', { status: 401 });
    }
}
