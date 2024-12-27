'use client';

import Button from '@/components/ui/button/Button';
import AuthForm from '@/layouts/auth-form/AuthForm';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';
import './LoginGoogleAuth.scss';
import Link from 'next/link';

export default function LoginGoogleAuth() {
  const router = useRouter();
  const backToHome = () => {
    router.push('/');
  };

  return (
    <div className="verify">
      <AuthForm>
        <Image src="/image/Verify.svg" alt="" width={350} height={400} />
        <div className="verify-title">Check your email</div>
        <div className="verify-desc">
          Please check your email. Once completed, you will be able to start using our service!
        </div>
        <div className="verify-button">
          <Button title="Back to home" size="large" onClick={backToHome} />
          <Link prefetch={false} href="mailto:contact@letsmetrix.com">
            <Button title="Contact us" size="large" />
          </Link>
        </div>
      </AuthForm>
    </div>
  );
}
