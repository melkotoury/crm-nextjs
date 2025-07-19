import prisma from '@/lib/prisma';

export const marketTrendResolvers = {
  Query: {
    marketTrends: async () => {
      return prisma.marketTrend.findMany();
    },
    marketTrend: async (_: any, { trend_id }: { trend_id: string }) => {
      return prisma.marketTrend.findUnique({ where: { trend_id: parseInt(trend_id) } });
    },
  },
  Mutation: {
    addMarketTrend: async (_: any, args: any) => {
      return prisma.marketTrend.create({ data: args });
    },
    updateMarketTrend: async (_: any, { trend_id, ...args }: { trend_id: string, [key: string]: any }) => {
      return prisma.marketTrend.update({
        where: { trend_id: parseInt(trend_id) },
        data: args,
      });
    },
    deleteMarketTrend: async (_: any, { trend_id }: { trend_id: string }) => {
      await prisma.marketTrend.delete({ where: { trend_id: parseInt(trend_id) } });
      return true;
    },
  },
};