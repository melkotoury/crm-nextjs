import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { compare } from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { username, password } = await request.json();

  try {
    const user = await prisma.user.findUnique({ where: { username } });

    if (!user) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const isValidPassword = await compare(password, user.password_hash);

    if (!isValidPassword) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const response = NextResponse.json({ message: 'Login successful', user: { id: user.user_id, username: user.username, email: user.email, role: user.role } });
    response.cookies.set('isLoggedIn', 'true', { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 * 7 }); // 1 week
    response.cookies.set('userId', String(user.user_id), { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 * 7 });
    response.cookies.set('userRole', user.role, { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 * 7 });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}