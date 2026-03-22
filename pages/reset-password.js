import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { Lock, Eye, EyeOff, ArrowLeft, CheckCircle, ShieldCheck } from 'lucide-react';
import AuthLayout from '@/layouts/AuthLayout';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';

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
  line-height: 1.6;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const BackLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.brandPrimary};
  text-decoration: none;
  margin-top: 24px;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }

  svg {
    width: 14px;
    height: 14px;
  }
`;

const PasswordRules = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textTertiary};
  line-height: 1.8;
  margin-top: -4px;
`;

const Rule = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: ${({ $met, theme }) => ($met ? '#3da637' : theme.colors.textTertiary)};

  svg {
    width: 12px;
    height: 12px;
  }
`;

const SuccessCard = styled.div`
  text-align: center;
  padding: 16px 0;
`;

const SuccessIcon = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #3da63718;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;

  svg {
    width: 28px;
    height: 28px;
    color: #3da637;
  }
`;

const SuccessTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
  margin: 0 0 8px;
`;

const SuccessText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
  line-height: 1.6;
`;

export default function ResetPasswordPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const watchPassword = watch('password', '');

  const rules = {
    length: watchPassword.length >= 6,
    uppercase: /[A-Z]/.test(watchPassword),
    number: /[0-9]/.test(watchPassword),
  };

  const onSubmit = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSuccess(true);
    setLoading(false);
    // Redirect to login after 3 seconds
    setTimeout(() => router.push('/login'), 3000);
  };

  return (
    <>
      <Head>
        <title>Reset Password – MuscleMind</title>
      </Head>

      <AuthLayout>
        {!success ? (
          <>
            <Title>Reset Password</Title>
            <Subtitle>
              Create a new password for your account. Make sure it is strong and secure.
            </Subtitle>

            <Form onSubmit={handleSubmit(onSubmit)}>
              <Input
                label="New Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter new password"
                leftIcon={<Lock size={16} />}
                rightIcon={showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                onRightIconClick={() => setShowPassword((v) => !v)}
                error={errors.password?.message}
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 6, message: 'Minimum 6 characters' },
                })}
              />

              <PasswordRules>
                <Rule $met={rules.length}>
                  <CheckCircle /> At least 6 characters
                </Rule>
                <Rule $met={rules.uppercase}>
                  <CheckCircle /> One uppercase letter
                </Rule>
                <Rule $met={rules.number}>
                  <CheckCircle /> One number
                </Rule>
              </PasswordRules>

              <Input
                label="Confirm Password"
                type={showConfirm ? 'text' : 'password'}
                placeholder="Re-enter new password"
                leftIcon={<Lock size={16} />}
                rightIcon={showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                onRightIconClick={() => setShowConfirm((v) => !v)}
                error={errors.confirmPassword?.message}
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (val) => val === watchPassword || 'Passwords do not match',
                })}
              />

              <Button type="submit" fullWidth loading={loading} size="lg">
                Reset Password
              </Button>
            </Form>

            <Link href="/login" passHref legacyBehavior>
              <BackLink>
                <ArrowLeft /> Back to Sign In
              </BackLink>
            </Link>
          </>
        ) : (
          <SuccessCard>
            <SuccessIcon>
              <ShieldCheck />
            </SuccessIcon>
            <SuccessTitle>Password Reset Successful</SuccessTitle>
            <SuccessText>
              Your password has been updated successfully. You will be redirected to the login page
              shortly.
            </SuccessText>

            <Link href="/login" passHref legacyBehavior>
              <Button as="a" fullWidth size="lg" style={{ marginTop: 24, textDecoration: 'none' }}>
                Go to Sign In
              </Button>
            </Link>
          </SuccessCard>
        )}
      </AuthLayout>
    </>
  );
}
