import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
import AuthLayout from '@/layouts/AuthLayout';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { useAuth } from '@/hooks/useAuth';

const Title = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeight.extrabold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0 0 8px;
`;

const Subtitle = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0 0 32px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ForgotLink = styled.a`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.brandPrimary};
  text-align: right;
  display: block;
  margin-top: 6px;
  cursor: pointer;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const ErrorAlert = styled.div`
  padding: 10px 14px;
  background: ${({ theme }) => `${theme.colors.error}11`};
  border: 1px solid ${({ theme }) => `${theme.colors.error}44`};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 8px 0;

  span {
    font-size: ${({ theme }) => theme.typography.fontSize.xs};
    color: ${({ theme }) => theme.colors.textTertiary};
    white-space: nowrap;
  }

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${({ theme }) => theme.colors.border};
  }
`;

const DemoBox = styled.div`
  background: ${({ theme }) => theme.colors.bgSecondary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 12px 16px;
  margin-top: 8px;

  p {
    font-size: ${({ theme }) => theme.typography.fontSize.xs};
    color: ${({ theme }) => theme.colors.textSecondary};
    margin: 2px 0;
  }

  strong {
    color: ${({ theme }) => theme.colors.brandPrimary};
  }
`;

const SignupLink = styled.p`
  text-align: center;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: 16px;

  a {
    color: ${({ theme }) => theme.colors.brandPrimary};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = (data) => login(data);

  return (
    <>
      <Head>
        <title>Login – MuscleMind</title>
      </Head>

      <AuthLayout>
        <Title>Welcome back 💪</Title>
        <Subtitle>Sign in to your MuscleMind account to continue.</Subtitle>

        {error && <ErrorAlert>{error}</ErrorAlert>}

        <Form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Email Address"
            type="email"
            placeholder="you@musclemind.io"
            leftIcon={<Mail size={16} />}
            error={errors.email?.message}
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' },
            })}
          />

          <div>
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              leftIcon={<Lock size={16} />}
              rightIcon={showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              onRightIconClick={() => setShowPassword((v) => !v)}
              error={errors.password?.message}
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Minimum 6 characters' },
              })}
            />
            <Link href="/forgot-password" passHref legacyBehavior>
              <ForgotLink>Forgot password?</ForgotLink>
            </Link>
          </div>

          <Button type="submit" fullWidth loading={isLoading} size="lg">
            Sign In to MuscleMind
          </Button>
        </Form>

        <Divider>
          <span>Demo credentials</span>
        </Divider>

        <DemoBox>
          <p>
            <strong>Super Admin:</strong> alex@musclemind.io
          </p>
          <p>
            <strong>Admin:</strong> jordan@musclemind.io
          </p>
          <p>
            <strong>Trainer:</strong> sam@musclemind.io
          </p>
          <p>
            <strong>Password:</strong> password123
          </p>
        </DemoBox>

        <SignupLink>
          Don&apos;t have an account? <Link href="/signup">Sign up free</Link>
        </SignupLink>
      </AuthLayout>
    </>
  );
}
