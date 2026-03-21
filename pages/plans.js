import React, { useEffect } from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import MainLayout from '@/layouts/MainLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import PlanCard from '@/components/plans/PlanCard';
import { setPlans, selectPlans } from '@/store/slices/plansSlice';
import { dummyPlans } from '@/data/dummyData';
import { ROLES } from '@/utils/constants';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  align-items: start;

  @media (max-width: ${({ theme }) => theme.breakpoints.xl}) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const PageHero = styled.div`
  text-align: center;
  margin-bottom: 48px;
  padding-top: 16px;

  h2 {
    font-size: ${({ theme }) => theme.typography.fontSize['4xl']};
    font-weight: ${({ theme }) => theme.typography.fontWeight.extrabold};
    color: ${({ theme }) => theme.colors.textPrimary};
    margin: 0 0 12px;
    background: linear-gradient(135deg, #1aa8d4, #3535cc);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  p {
    font-size: ${({ theme }) => theme.typography.fontSize.md};
    color: ${({ theme }) => theme.colors.textSecondary};
    margin: 0;
    max-width: 500px;
    margin: 0 auto;
  }
`;

export default function PlansPage() {
  const dispatch = useDispatch();
  const plans = useSelector(selectPlans);

  useEffect(() => {
    if (!plans.length) dispatch(setPlans(dummyPlans));
  }, [dispatch, plans.length]);

  return (
    <ProtectedRoute requiredRole={ROLES.ADMIN}>
      <Head>
        <title>Subscription Plans – MuscleMind</title>
      </Head>

      <MainLayout title="Subscription Plans" subtitle="Manage membership tiers and pricing.">
        <PageHero>
          <h2>Choose the Right Plan</h2>
          <p>Flexible membership options built for every fitness journey.</p>
        </PageHero>

        <Grid>
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </Grid>
      </MainLayout>
    </ProtectedRoute>
  );
}
