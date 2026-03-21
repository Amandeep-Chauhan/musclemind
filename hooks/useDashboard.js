import { useQuery } from '@tanstack/react-query';
import { dashboardService } from '@/services/dashboardService';
import { QUERY_KEYS } from '@/utils/constants';

const STALE = 1000 * 60 * 5; // 5 minutes

export const useDashboard = () => {
  const stats = useQuery({
    queryKey: [QUERY_KEYS.DASHBOARD_STATS],
    queryFn: dashboardService.getStats,
    staleTime: STALE,
  });

  const revenue = useQuery({
    queryKey: [QUERY_KEYS.REVENUE_DATA],
    queryFn: dashboardService.getRevenueData,
    staleTime: STALE,
  });

  const memberGrowth = useQuery({
    queryKey: [QUERY_KEYS.MEMBER_GROWTH],
    queryFn: dashboardService.getMemberGrowthData,
    staleTime: STALE,
  });

  const planDistribution = useQuery({
    queryKey: [QUERY_KEYS.PLAN_DISTRIBUTION],
    queryFn: dashboardService.getPlanDistribution,
    staleTime: STALE,
  });

  const activities = useQuery({
    queryKey: [QUERY_KEYS.RECENT_ACTIVITIES],
    queryFn: dashboardService.getRecentActivities,
    staleTime: STALE,
  });

  const attendance = useQuery({
    queryKey: [QUERY_KEYS.WEEKLY_ATTENDANCE],
    queryFn: dashboardService.getWeeklyAttendance,
    staleTime: STALE,
  });

  return { stats, revenue, memberGrowth, planDistribution, activities, attendance };
};
