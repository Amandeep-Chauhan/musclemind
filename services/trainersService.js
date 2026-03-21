import { dummyTrainers } from '@/data/dummyData';

let _trainers = [...dummyTrainers];
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export const trainersService = {
  async getAll(filters = {}) {
    await delay(500);
    let result = [..._trainers];
    if (filters.search) {
      const s = filters.search.toLowerCase();
      result = result.filter((t) => t.name.toLowerCase().includes(s));
    }
    if (filters.status && filters.status !== 'all') {
      result = result.filter((t) => t.status === filters.status);
    }
    return { data: result, total: result.length };
  },

  async getById(id) {
    await delay(400);
    const trainer = _trainers.find((t) => t.id === id);
    if (!trainer) throw { message: 'Trainer not found.' };
    return trainer;
  },

  async create(data) {
    await delay(700);
    const newTrainer = {
      ...data,
      id: `t${Date.now()}`,
      totalClients: 0,
      activeClients: 0,
      sessionsThisMonth: 0,
      rating: 0,
      joinDate: new Date().toISOString().split('T')[0],
    };
    _trainers.unshift(newTrainer);
    return newTrainer;
  },

  async update(id, data) {
    await delay(600);
    const idx = _trainers.findIndex((t) => t.id === id);
    if (idx === -1) throw { message: 'Trainer not found.' };
    _trainers[idx] = { ..._trainers[idx], ...data };
    return _trainers[idx];
  },

  async delete(id) {
    await delay(500);
    _trainers = _trainers.filter((t) => t.id !== id);
    return { success: true };
  },
};
