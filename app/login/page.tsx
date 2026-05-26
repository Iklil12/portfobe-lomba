// app/login/page.tsx — Server Component wrapper
// Redirect ke dashboard jika sudah login
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import LoginClient from './LoginClient';

export default function LoginPage() {
  return <LoginClient />;
}