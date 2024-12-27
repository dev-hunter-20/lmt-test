'use client';

import AuthApiService from '@/api-services/api/auth/AuthApiService';
import Auth from '@/utils/store/Authentication';
import { useSearchParams } from 'next/navigation';
import React, { useEffect } from 'react';

export default function LoginGoogle() {
  const searchParams = useSearchParams();
  const state = searchParams.get('state');
  const code = searchParams.get('code');
  const APP_DOMAIN = process.env.NEXT_PUBLIC_REACT_APP_DOMAIN;

  useEffect(() => {
    async function loginGoogle() {
      if (state && code) {
        const result = await AuthApiService.loginGoogle(state, code);
        if (result && result.code == 0) {
          Auth.setAccessToken(result.token);
          Auth.setCurrentUser(result.fullname);
          Auth.setCurrentUserName(result.username);
          Auth.setRefreshToken(result.refresh_token);
          window.location.href = APP_DOMAIN;
        } else {
          window.location.href = APP_DOMAIN + 'auth/register-error';
        }
      } else {
        window.location.href = APP_DOMAIN + 'auth/register-error';
      }
    }

    loginGoogle();
  }, []);

  return null;
}
