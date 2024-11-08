import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    if (token === 'newFakeAccessToken456') {
        return NextResponse.json({ data: 'This is protected data' });
    } else {
        return new NextResponse('Forbidden', { status: 403 });
    }
}
