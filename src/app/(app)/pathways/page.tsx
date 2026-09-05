import { getAuthenticatedUser } from '@/lib/auth';
import PathwaysClient from './PathwaysClient';

export const dynamic = 'force-dynamic';

export default async function PathwaysPage() {
  await getAuthenticatedUser();
  return <PathwaysClient />;
}