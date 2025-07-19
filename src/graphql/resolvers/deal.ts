import prisma from '@/lib/prisma';

export const dealResolvers = {
  Query: {
    deals: async () => {
      return prisma.deal.findMany();
    },
    deal: async (_: any, { deal_id }: { deal_id: string }) => {
      return prisma.deal.findUnique({ where: { deal_id: parseInt(deal_id) } });
    },
  },
  Mutation: {
    addDeal: async (_: any, args: any) => {
      return prisma.deal.create({ data: args });
    },
    updateDeal: async (_: any, { deal_id, ...args }: { deal_id: string, [key: string]: any }) => {
      return prisma.deal.update({
        where: { deal_id: parseInt(deal_id) },
        data: args,
      });
    },
    deleteDeal: async (_: any, { deal_id }: { deal_id: string }) => {
      await prisma.deal.delete({ where: { deal_id: parseInt(deal_id) } });
      return true;
    },
  },
};