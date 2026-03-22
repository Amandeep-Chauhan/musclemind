import React, { useState } from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import MainLayout from '@/layouts/MainLayout';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import PlanCard from '@/components/plans/PlanCard';
import Modal from '@/components/common/Modal';
import Button from '@/components/common/Button';
import Input from '@/components/common/Input';
import { dummyPlans } from '@/data/dummyData';
import { ROLES } from '@/utils/constants';
import { useForm } from 'react-hook-form';

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

// ── Form Styled ───────────────────────────────────────────────────────────────

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const FullWidth = styled.div`
  grid-column: 1 / -1;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const SectionDivider = styled.div`
  grid-column: 1 / -1;
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semibold};
  color: ${({ theme }) => theme.colors.textTertiary};
  text-transform: uppercase;
  letter-spacing: 0.7px;
  padding-bottom: 6px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  margin-top: 4px;
`;

const ColorPreview = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ColorSwatch = styled.div`
  width: 32px;
  height: 32px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: ${({ $color }) => $color};
  border: 2px solid ${({ theme }) => theme.colors.border};
  flex-shrink: 0;
`;

const ColorInput = styled.input`
  flex: 1;
  padding: 9px 14px;
  background: ${({ theme }) => theme.colors.bgInput};
  border: 1.5px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  outline: none;
  transition: border-color ${({ theme }) => theme.transitions.fast};

  &:focus {
    border-color: ${({ theme }) => theme.colors.brandPrimary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.brandPrimary}22;
  }
`;

// ── Page ──────────────────────────────────────────────────────────────────────

export default function PlansPage() {
  const [plans, setPlans] = useState(dummyPlans);
  const [editPlan, setEditPlan] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  React.useEffect(() => {
    if (editPlan) {
      reset({
        name: editPlan.name,
        price: editPlan.price,
        billingCycle: editPlan.billingCycle,
        icon: editPlan.icon,
        color: editPlan.color,
        features: (editPlan.features || []).join('\n'),
        notIncluded: (editPlan.notIncluded || []).join('\n'),
      });
    }
  }, [editPlan, reset]);

  const watchColor = watch('color', editPlan?.color || '#1aa8d4');

  const onSubmit = async (data) => {
    await new Promise((r) => setTimeout(r, 600));
    const payload = {
      ...data,
      price: Number(data.price),
      features: data.features
        .split('\n')
        .map((f) => f.trim())
        .filter(Boolean),
      notIncluded: data.notIncluded
        .split('\n')
        .map((f) => f.trim())
        .filter(Boolean),
    };
    setPlans((prev) => prev.map((p) => (p.id === editPlan.id ? { ...p, ...payload } : p)));
    setEditPlan(null);
  };

  return (
    <ProtectedRoute requiredRole={ROLES.ADMIN}>
      <Head>
        <title>Subscription Plans – MuscleMind</title>
      </Head>

      <MainLayout title="Subscription Plans" subtitle="Manage membership tiers and pricing.">
        <Grid>
          {plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} onEdit={setEditPlan} />
          ))}
        </Grid>

        {/* Edit Plan Modal */}
        <Modal
          isOpen={!!editPlan}
          onClose={() => setEditPlan(null)}
          title="Edit Plan"
          subtitle={editPlan ? `Editing — ${editPlan.name}` : ''}
          size="lg"
          footer={
            <>
              <Button variant="ghost" onClick={() => setEditPlan(null)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit(onSubmit)} loading={isSubmitting}>
                Save Changes
              </Button>
            </>
          }
        >
          {editPlan && (
            <FormGrid>
              <SectionDivider>Plan Details</SectionDivider>

              <Input
                label="Plan Name"
                required
                placeholder="e.g. 6 Months"
                error={errors.name?.message}
                {...register('name', { required: 'Name is required' })}
              />

              <Input
                label="Price (₹)"
                type="number"
                required
                placeholder="0"
                error={errors.price?.message}
                {...register('price', {
                  required: 'Price is required',
                  min: { value: 1, message: 'Must be > 0' },
                })}
              />

              <Input
                label="Billing Cycle"
                placeholder="e.g. 6 months"
                {...register('billingCycle')}
              />

              <SectionDivider>Appearance</SectionDivider>

              <FormGroup>
                <Label>Theme Color</Label>
                <ColorPreview>
                  <ColorSwatch $color={watchColor} />
                  <ColorInput type="text" placeholder="#1aa8d4" {...register('color')} />
                </ColorPreview>
              </FormGroup>

              <SectionDivider>Features</SectionDivider>

              <FullWidth>
                <Input
                  label="Included Features (one per line)"
                  textarea
                  placeholder={'Full gym floor access\nLocker room & showers\n2 group classes/week'}
                  style={{ minHeight: 100 }}
                  {...register('features')}
                />
              </FullWidth>

              <FullWidth>
                <Input
                  label="Not Included (one per line)"
                  textarea
                  placeholder={'Personal trainer\nPool & sauna'}
                  style={{ minHeight: 60 }}
                  {...register('notIncluded')}
                />
              </FullWidth>
            </FormGrid>
          )}
        </Modal>
      </MainLayout>
    </ProtectedRoute>
  );
}
