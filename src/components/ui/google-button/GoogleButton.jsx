'use client';

import React, { useCallback } from 'react';
import classNames from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import './GoogleButton.scss';
import Icon from '../icon/Icon';
import { EIconName } from '@/common/enums';
import { loginGoogle } from '@/redux/slice/auth/LoginApp';

const GoogleButton = () => {
  const dispatch = useDispatch();
  const googleLoginLoading = useSelector((state) => state.loginApp.isLoading);

  const handleGoogleLoginSuccess = (response) => {
    window.open(response.authorization_url, '_self');
  };

  const handleClick = useCallback(() => {
    if (!googleLoginLoading) {
      const params = {};
      dispatch(loginGoogle(params))
        .then((action) => {
          if (action.meta.requestStatus === 'fulfilled') {
            handleGoogleLoginSuccess(action.payload);
          }
        })
        .catch((error) => {
          console.error('Google login failed:', error);
        });
    }
  }, [googleLoginLoading, dispatch]);

  return (
    <div
      className={classNames('GoogleBtn flex items-center justify-center', { disabled: googleLoginLoading })}
      onClick={handleClick}
    >
      <Icon name={EIconName.Google} />
      <span>Sign in with Google</span>
    </div>
  );
};

export default GoogleButton;
