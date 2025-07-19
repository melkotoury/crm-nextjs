import prisma from '@/lib/prisma';

export const crossSellingOpportunityResolvers = {
  Query: {
    crossSellingOpportunities: async () => {
      return prisma.crossSellingOpportunity.findMany();
    },
    crossSellingOpportunity: async (_: any, { opportunity_id }: { opportunity_id: string }) => {
      return prisma.crossSellingOpportunity.findUnique({ where: { opportunity_id: parseInt(opportunity_id) } });
    },
  },
  Mutation: {
    addCrossSellingOpportunity: async (_: any, args: any) => {
      return prisma.crossSellingOpportunity.create({ data: args });
    },
    updateCrossSellingOpportunity: async (_: any, { opportunity_id, ...args }: { opportunity_id: string, [key: string]: any }) => {
      return prisma.crossSellingOpportunity.update({
        where: { opportunity_id: parseInt(opportunity_id) },
        data: args,
      });
    },
    deleteCrossSellingOpportunity: async (_: any, { opportunity_id }: { opportunity_id: string }) => {
      await prisma.crossSellingOpportunity.delete({ where: { opportunity_id: parseInt(opportunity_id) } });
      return true;
    },
  },
};