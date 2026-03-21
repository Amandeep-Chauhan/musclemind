import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
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
  margin: 0 0 28px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ErrorAlert = styled.div`
  padding: 10px 14px;
  background: ${({ theme }) => `${theme.colors.error}11`};
  border: 1px solid ${({ theme }) => `${theme.colors.error}44`};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const Terms = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textTertiary};
  text-align: center;
  margin: 0;

  a {
    color: ${({ theme }) => theme.colors.brandPrimary};
    text-decoration: none;
    &:hover { text-decoration: underline; }
  }
`;

const LoginLink = styled.p`
  text-align: center;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: 16px;

  a {
    color: ${({ theme }) => theme.colors.brandPrimary};
    font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
    text-decoration: none;
    &:hover { text-decoration: underline; }
  }
`;

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { signup, isLoading, error } = useAuth();

  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  const password = watch('password');

  const onSubmit = ({ name, email, password }) => signup({ name, email, password });

  return (
    <>
      <Head>
        <title>Sign Up – MuscleMind</title>
      </Head>

      <AuthLayout>
        <Title>Start your journey 🔥</Title>
        <Subtitle>Create your MuscleMind account and take control of your gym.</Subtitle>

        {error && <ErrorAlert>{error}</ErrorAlert>}

        <Form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Full Name"
            placeholder="e.g. Alex Carter"
            leftIcon={<User size={16} />}
            error={errors.name?.message}
            {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Min 2 characters' } })}
          />

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

          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Create a strong password"
            leftIcon={<Lock size={16} />}
            rightIcon={showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            onRightIconClick={() => setShowPassword((v) => !v)}
            error={errors.password?.message}
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 8, message: 'Minimum 8 characters' },
            })}
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="Repeat your password"
            leftIcon={<Lock size={16} />}
            error={errors.confirmPassword?.message}
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: (v) => v === password || 'Passwords do not match',
            })}
          />

          <Button type="submit" fullWidth loading={isLoading} size="lg">
            Create Account
          </Button>

          <Terms>
            By signing up, you agree to our <a href="#">Terms of Service</a> and{' '}
            <a href="#">Privacy Policy</a>.
          </Terms>
        </Form>

        <LoginLink>
          Already have an account? <Link href="/login">Sign in</Link>
        </LoginLink>
      </AuthLayout>
    </>
  );
}
