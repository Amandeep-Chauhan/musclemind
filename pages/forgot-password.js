import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
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

const SuccessCard = styled.div`
  text-align: center;
  padding: 16px 0;
`;

const SuccessIcon = styled.div`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.brandPrimary}18;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;

  svg {
    width: 28px;
    height: 28px;
    color: ${({ theme }) => theme.colors.brandPrimary};
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
  margin: 0 0 8px;
  line-height: 1.6;
`;

const EmailHighlight = styled.span`
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.brandPrimary};
`;

const ResendText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.textTertiary};
  margin: 16px 0 0;
`;

const ResendBtn = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.brandPrimary};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  cursor: pointer;
  text-decoration: underline;
`;

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);
  const [sentEmail, setSentEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1500));
    setSentEmail(data.email);
    setSent(true);
    setLoading(false);
  };

  const handleResend = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
  };

  return (
    <>
      <Head>
        <title>Forgot Password – MuscleMind</title>
      </Head>

      <AuthLayout>
        {!sent ? (
          <>
            <Title>Forgot Password?</Title>
            <Subtitle>
              Enter your registered email address and we will send you a link to reset your
              password.
            </Subtitle>

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

              <Button type="submit" fullWidth loading={loading} size="lg">
                Send Reset Link
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
              <CheckCircle />
            </SuccessIcon>
            <SuccessTitle>Check your email</SuccessTitle>
            <SuccessText>
              We sent a password reset link to
              <br />
              <EmailHighlight>{sentEmail}</EmailHighlight>
            </SuccessText>
            <SuccessText>
              Click the link in the email to reset your password. The link expires in 30 minutes.
            </SuccessText>

            <Link href="/reset-password" passHref legacyBehavior>
              <Button as="a" fullWidth size="lg" style={{ marginTop: 16, textDecoration: 'none' }}>
                Open Reset Page (Demo)
              </Button>
            </Link>

            <ResendText>
              Didn&apos;t receive the email?{' '}
              <ResendBtn onClick={handleResend} disabled={loading}>
                {loading ? 'Sending...' : 'Resend'}
              </ResendBtn>
            </ResendText>

            <Link href="/login" passHref legacyBehavior>
              <BackLink>
                <ArrowLeft /> Back to Sign In
              </BackLink>
            </Link>
          </SuccessCard>
        )}
      </AuthLayout>
    </>
  );
}
