'use client';

import { ETypeNotification } from '@/common/enums';
import { LayoutPaths, Paths } from '@/router';
import Button from '@/components/ui/button/Button';
import AuthForm from '@/layouts/auth-form/AuthForm';
import { showNotification } from '@/utils/functions';
import { Form } from 'antd';
import Link from 'next/link';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './CheckYourEmailPage.scss';
import { useSearchParams } from 'next/navigation';
import { resetError, resetPassword } from '@/redux/slice/auth/ResetPassword';

export default function CheckYourEmailPage() {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const searchParams = useSearchParams();
  const urlEmail = searchParams.get('email');
  const { resetPasswordLoading, error } = useSelector((state) => state.resetPassword);

  useEffect(() => {
    if (error) {
      showNotification(ETypeNotification.ERROR, error);
      dispatch(resetError());
    }
  }, [error, dispatch]);

  const handleSubmit = async () => {
    try {
      await dispatch(resetPassword({ email: urlEmail })).unwrap();
      showNotification(ETypeNotification.SUCCESS, 'Request Successfully. Please check your mailbox.');
    } catch (err) {
      showNotification(ETypeNotification.ERROR, err.message);
    }
  };

  return (
    <div className="CheckYourEmail">
      <AuthForm>
        <div className="CheckYourEmail-title">Check your email</div>
        <div className="CheckYourEmail-description">We’ve sent a password recover instructions to your email.</div>
        <Form layout="vertical" form={form} className="CheckYourEmail-form">
          <div className="CheckYourEmail-submit">
            <Button
              title="Open email"
              size="large"
              htmlType="submit"
              link="https://mail.google.com/mail/u/0/#search/omega"
              target="_blank"
            />
          </div>
        </Form>
        <div className="CheckYourEmail-description">
          <Link prefetch={false} href={`${LayoutPaths.Auth}${Paths.LoginApp}`}>
            <u>Skip, I'll confirm later</u>
          </Link>
        </div>

        <div className="CheckYourEmail-description">
          <i>
            Did not receive the email?
            {` `}
            <u
              className="cursor-pointer"
              onClick={() => {
                !resetPasswordLoading && handleSubmit();
              }}
            >
              Please resend
            </u>
            .
          </i>
        </div>
      </AuthForm>
    </div>
  );
}
