import { dummyMembers } from '@/data/dummyData';

let _members = [...dummyMembers];
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export const membersService = {
  async getAll(filters = {}) {
    await delay(600);
    let result = [..._members];

    if (filters.search) {
      const s = filters.search.toLowerCase();
      result = result.filter(
        (m) => m.name.toLowerCase().includes(s) || m.email.toLowerCase().includes(s)
      );
    }
    if (filters.status && filters.status !== 'all') {
      result = result.filter((m) => m.status === filters.status);
    }
    if (filters.plan && filters.plan !== 'all') {
      result = result.filter((m) => m.plan.toLowerCase() === filters.plan.toLowerCase());
    }

    return { data: result, total: result.length };
    // Real: return api.get('/members', { params: filters });
  },

  async getById(id) {
    await delay(400);
    const member = _members.find((m) => m.id === id);
    if (!member) throw { message: 'Member not found.' };
    return member;
    // Real: return api.get(`/members/${id}`);
  },

  async create(data) {
    await delay(700);
    const newMember = {
      ...data,
      id: `m${Date.now()}`,
      joinDate: new Date().toISOString().split('T')[0],
      totalSessions: 0,
      attendanceRate: 0,
    };
    _members.unshift(newMember);
    return newMember;
    // Real: return api.post('/members', data);
  },

  async update(id, data) {
    await delay(600);
    const idx = _members.findIndex((m) => m.id === id);
    if (idx === -1) throw { message: 'Member not found.' };
    _members[idx] = { ..._members[idx], ...data };
    return _members[idx];
    // Real: return api.patch(`/members/${id}`, data);
  },

  async delete(id) {
    await delay(500);
    _members = _members.filter((m) => m.id !== id);
    return { success: true };
    // Real: return api.delete(`/members/${id}`);
  },

  async getStats() {
    await delay(400);
    return {
      total: _members.length,
      active: _members.filter((m) => m.status === 'active').length,
      inactive: _members.filter((m) => m.status === 'inactive').length,
      pending: _members.filter((m) => m.status === 'pending').length,
    };
  },
};
