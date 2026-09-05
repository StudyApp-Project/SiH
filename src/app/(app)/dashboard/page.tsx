import { getAuthenticatedUser } from '@/lib/auth';
import DashboardClient from './DashboardClient';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const user = await getAuthenticatedUser();
  return <DashboardClient user={{ ...user, email: user.email }} />;
}
