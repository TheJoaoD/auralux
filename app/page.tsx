import { redirect } from 'next/navigation'

export default function Home() {
  // Redirect root to login page
  // User will be redirected to /dashboard by middleware if already authenticated
  redirect('/login')
}
