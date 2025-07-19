import prisma from '@/lib/prisma';

export const analyticsResolvers = {
  Query: {
    totalContacts: async () => {
      return prisma.contact.count();
    },
    totalLeads: async () => {
      return prisma.lead.count();
    },
    totalDeals: async () => {
      return prisma.deal.count();
    },
    dealsByStage: async () => {
      const result = await prisma.deal.groupBy({
        by: ['stage'],
        _count: {
          stage: true,
        },
      });
      return result.map((item) => ({
        stage: item.stage,
        count: item._count.stage,
      }));
    },
    leadsByStatus: async () => {
      const result = await prisma.lead.groupBy({
        by: ['status'],
        _count: {
          status: true,
        },
      });
      return result.map((item) => ({
        status: item.status,
        count: item._count.status,
      }));
    },
  },
};