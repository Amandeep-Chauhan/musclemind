import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import Modal from '@/components/common/Modal';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { fitnessGoals, dummyPlans } from '@/data/dummyData';

const Grid = styled.div`
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

const Select = styled.select`
  width: 100%;
  padding: 9px 36px 9px 14px;
  background: ${({ theme }) => theme.colors.bgInput};
  border: 1.5px solid ${({ $error, theme }) => $error ? theme.colors.error : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  outline: none;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 12px center;
  cursor: pointer;
  transition: border-color ${({ theme }) => theme.transitions.fast},
              box-shadow ${({ theme }) => theme.transitions.fast};

  &:focus {
    border-color: ${({ theme }) => theme.colors.brandPrimary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.brandPrimary}22;
  }

  &:hover:not(:focus) {
    border-color: ${({ theme }) => theme.colors.borderHover};
  }
`;

const ErrorText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.error};
  margin: 0;
`;

const DEFAULT_VALUES = {
  name: '',
  email: '',
  phone: '',
  planId: 'p1',
  goal: '',
  gender: 'male',
  age: '',
  weight: '',
  height: '',
};

export default function MemberForm({ isOpen, onClose, member }) {
  const isEditing = !!member;

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    defaultValues: DEFAULT_VALUES,
  });

  useEffect(() => {
    if (isOpen) {
      reset(member || DEFAULT_VALUES);
    }
  }, [isOpen, member, reset]);

  const onSubmit = async (data) => {
    await new Promise((r) => setTimeout(r, 800)); // Simulate API call
    console.warn('Member saved:', data);
    reset();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Member' : 'Add New Member'}
      subtitle={isEditing ? `Editing ${member?.name}` : 'Fill in the details to add a new gym member.'}
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            loading={isSubmitting}
          >
            {isEditing ? 'Save Changes' : 'Add Member'}
          </Button>
        </>
      }
    >
      <Grid>
        <Input
          label="Full Name"
          required
          placeholder="e.g. Marcus Thompson"
          error={errors.name?.message}
          {...register('name', { required: 'Name is required' })}
        />
        <Input
          label="Email Address"
          required
          type="email"
          placeholder="member@email.com"
          error={errors.email?.message}
          {...register('email', {
            required: 'Email is required',
            pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' },
          })}
        />
        <Input
          label="Phone Number"
          placeholder="+1 (555) 000-0000"
          error={errors.phone?.message}
          {...register('phone')}
        />
        <Input
          label="Age"
          type="number"
          placeholder="25"
          error={errors.age?.message}
          {...register('age', { min: { value: 16, message: 'Must be 16+' } })}
        />

        <FormGroup>
          <Label>Gender</Label>
          <Select {...register('gender')}>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </Select>
        </FormGroup>

        <FormGroup>
          <Label>Subscription Plan <span style={{ color: 'red' }}>*</span></Label>
          <Select {...register('planId', { required: 'Plan is required' })} $error={!!errors.planId}>
            {dummyPlans.map((p) => (
              <option key={p.id} value={p.id}>{p.name} — ${p.price}/mo</option>
            ))}
          </Select>
          {errors.planId && <ErrorText>{errors.planId.message}</ErrorText>}
        </FormGroup>

        <FormGroup>
          <Label>Fitness Goal</Label>
          <Select {...register('goal')}>
            <option value="">Select a goal</option>
            {fitnessGoals.map((g) => <option key={g} value={g}>{g}</option>)}
          </Select>
        </FormGroup>

        <Input
          label="Weight"
          placeholder="e.g. 75 kg"
          {...register('weight')}
        />

        <Input
          label="Height"
          placeholder="e.g. 180 cm"
          {...register('height')}
        />

        <FullWidth>
          <Input
            label="Notes"
            textarea
            placeholder="Any additional notes about this member..."
            {...register('notes')}
          />
        </FullWidth>
      </Grid>
    </Modal>
  );
}
