import prisma from '@/lib/prisma';

export const churnPredictionResolvers = {
  Query: {
    churnPredictions: async () => {
      return prisma.churnPrediction.findMany();
    },
    churnPrediction: async (_: any, { churn_id }: { churn_id: string }) => {
      return prisma.churnPrediction.findUnique({ where: { churn_id: parseInt(churn_id) } });
    },
  },
  Mutation: {
    addChurnPrediction: async (_: any, args: any) => {
      return prisma.churnPrediction.create({ data: args });
    },
    updateChurnPrediction: async (_: any, { churn_id, ...args }: { churn_id: string, [key: string]: any }) => {
      return prisma.churnPrediction.update({
        where: { churn_id: parseInt(churn_id) },
        data: args,
      });
    },
    deleteChurnPrediction: async (_: any, { churn_id }: { churn_id: string }) => {
      await prisma.churnPrediction.delete({ where: { churn_id: parseInt(churn_id) } });
      return true;
    },
  },
};