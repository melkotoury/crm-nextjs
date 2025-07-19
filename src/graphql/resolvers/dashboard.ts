import prisma from '@/lib/prisma';

export const dashboardResolvers = {
  Query: {
    dashboards: async () => {
      return prisma.dashboard.findMany();
    },
    dashboard: async (_: any, { dashboard_id }: { dashboard_id: string }) => {
      return prisma.dashboard.findUnique({ where: { dashboard_id: parseInt(dashboard_id) } });
    },
  },
  Mutation: {
    addDashboard: async (_: any, args: any) => {
      return prisma.dashboard.create({ data: args });
    },
    updateDashboard: async (_: any, { dashboard_id, ...args }: { dashboard_id: string, [key: string]: any }) => {
      return prisma.dashboard.update({
        where: { dashboard_id: parseInt(dashboard_id) },
        data: args,
      });
    },
    deleteDashboard: async (_: any, { dashboard_id }: { dashboard_id: string }) => {
      await prisma.dashboard.delete({ where: { dashboard_id: parseInt(dashboard_id) } });
      return true;
    },
  },
};