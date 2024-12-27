/* eslint-disable react/no-unescaped-entities */
'use client';

import React, { useEffect } from 'react';
import './ResetPasswordPage.scss';
import AuthForm from '@/layouts/auth-form/AuthForm';
import { Form } from 'antd';
import Input from '@/components/ui/input/Input';
import Button from '@/components/ui/button/Button';
import Link from 'next/link';
import { LayoutPaths, Paths } from '@/router';
import { showNotification, validationRules } from '@/utils/functions';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { MailOutlined } from '@ant-design/icons';
import { resetError, resetPassword } from '@/redux/slice/auth/ResetPassword';
import { ETypeNotification } from '@/common/enums';

export default function ResetPasswordPage() {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const router = useRouter();
  const { resetPasswordLoading, error, email } = useSelector((state) => state.resetPassword);

  useEffect(() => {
    if (error) {
      showNotification(ETypeNotification.ERROR, error);
      dispatch(resetError());
    }
  }, [error, dispatch]);

  const handleSubmit = (values) => {
    dispatch(resetPassword(values));
  };

  useEffect(() => {
    if (email) {
      router.push(`${LayoutPaths.Auth}${Paths.CheckYourEmail}?email=${email}`);
    }
  }, [email, router]);

  return (
    <div className="ResetPassword">
      <AuthForm>
        <div className="ResetPassword-title">Reset Password</div>
        <div className="ResetPassword-description">
          Please enter the email associated with your account and we'll send. a email with instuctions to reset your
          password.
        </div>
        <Form layout="vertical" form={form} className="ResetPassword-form" onFinish={handleSubmit}>
          <Form.Item name="email" rules={[validationRules.required(), validationRules.email()]}>
            <Input prefix={<MailOutlined />} placeholder="Email " size="large" />
          </Form.Item>
          <div className="ResetPassword-submit">
            <Button title="Send Instructions" size="large" htmlType="submit" loading={resetPasswordLoading} />
          </div>
        </Form>
        <div className="ResetPassword-description">
          <i>
            You remember your password?{' '}
            <span>
              <Link prefetch={false} href={`${LayoutPaths.Auth}${Paths.LoginApp}`}>
                Sign in
              </Link>
            </span>
          </i>
        </div>
      </AuthForm>
    </div>
  );
}
