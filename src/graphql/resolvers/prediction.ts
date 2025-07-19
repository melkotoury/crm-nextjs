import prisma from '@/lib/prisma';

export const predictionResolvers = {
  Query: {
    predictions: async () => {
      return prisma.prediction.findMany();
    },
    prediction: async (_: any, { prediction_id }: { prediction_id: string }) => {
      return prisma.prediction.findUnique({ where: { prediction_id: parseInt(prediction_id) } });
    },
  },
  Mutation: {
    addPrediction: async (_: any, args: any) => {
      return prisma.prediction.create({ data: args });
    },
    updatePrediction: async (_: any, { prediction_id, ...args }: { prediction_id: string, [key: string]: any }) => {
      return prisma.prediction.update({
        where: { prediction_id: parseInt(prediction_id) },
        data: args,
      });
    },
    deletePrediction: async (_: any, { prediction_id }: { prediction_id: string }) => {
      await prisma.prediction.delete({ where: { prediction_id: parseInt(prediction_id) } });
      return true;
    },
  },
};