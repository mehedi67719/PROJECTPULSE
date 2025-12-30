'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

const PrivateRoute = ({ children, allowedRoles }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return; // session লোড হওয়া পর্যন্ত অপেক্ষা

    if (!session) {
      // লগআউট user → login page
      router.push('/Authintaction/login');
    } else if (allowedRoles && !allowedRoles.includes(session.user.role)) {
      // logged-in কিন্তু role mismatch → home page
      router.push('/');
    }
  }, [session, status, router, allowedRoles]);

  // session validate না হলে কিছু render হবে না
  if (status === 'loading' || !session || (allowedRoles && !allowedRoles.includes(session.user.role))) {
    return null;
  }

  return <>{children}</>;
};

export default PrivateRoute;
