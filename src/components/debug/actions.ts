'use server';

import { z } from 'zod';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

const tempUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export async function createTempUser(values: z.infer<typeof tempUserSchema>) {
  if (process.env.NODE_ENV === 'production') {
    return { success: false, error: 'This feature is not available in production.' };
  }
  
  const validatedFields = tempUserSchema.safeParse(values);
  if (!validatedFields.success) {
    return { success: false, error: 'Invalid data' };
  }

  const { email, password } = validatedFields.data;

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { success: false, error: 'User with this email already exists.' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: `Temp ${email.split('@')[0]}`,
        emailVerified: new Date(),
      },
    });

    return { success: true, email };
  } catch (error) {
    console.error('Failed to create temp user:', error);
    return { success: false, error: 'A server error occurred.' };
  }
}
