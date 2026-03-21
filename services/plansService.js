import { dummyPlans } from '@/data/dummyData';

let _plans = [...dummyPlans];
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export const plansService = {
  async getAll() {
    await delay(500);
    return { data: _plans, total: _plans.length };
  },

  async getById(id) {
    await delay(400);
    const plan = _plans.find((p) => p.id === id);
    if (!plan) throw { message: 'Plan not found.' };
    return plan;
  },

  async create(data) {
    await delay(700);
    const newPlan = { ...data, id: `p${Date.now()}`, currentMembers: 0 };
    _plans.push(newPlan);
    return newPlan;
  },

  async update(id, data) {
    await delay(600);
    const idx = _plans.findIndex((p) => p.id === id);
    if (idx === -1) throw { message: 'Plan not found.' };
    _plans[idx] = { ..._plans[idx], ...data };
    return _plans[idx];
  },

  async delete(id) {
    await delay(500);
    _plans = _plans.filter((p) => p.id !== id);
    return { success: true };
  },
};
