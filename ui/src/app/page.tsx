import { redirect } from 'next/navigation';

export default function HomePage() {
  redirect('/welcome');
  return null;
}
