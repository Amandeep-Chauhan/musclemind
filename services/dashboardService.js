import {
  dashboardStats,
  revenueChartData,
  memberGrowthData,
  planDistributionData,
  recentActivities,
  weeklyAttendance,
} from '@/data/dummyData';

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

export const dashboardService = {
  async getStats() {
    await delay(500);
    return dashboardStats;
  },

  async getRevenueData() {
    await delay(600);
    return revenueChartData;
  },

  async getMemberGrowthData() {
    await delay(600);
    return memberGrowthData;
  },

  async getPlanDistribution() {
    await delay(400);
    return planDistributionData;
  },

  async getRecentActivities() {
    await delay(400);
    return recentActivities;
  },

  async getWeeklyAttendance() {
    await delay(400);
    return weeklyAttendance;
  },
};
