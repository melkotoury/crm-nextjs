import prisma from '@/lib/prisma';

export const workflowStepResolvers = {
  Query: {
    workflowSteps: async () => {
      return prisma.workflowStep.findMany();
    },
    workflowStep: async (_: any, { step_id }: { step_id: string }) => {
      return prisma.workflowStep.findUnique({ where: { step_id: parseInt(step_id) } });
    },
  },
  Mutation: {
    addWorkflowStep: async (_: any, args: any) => {
      return prisma.workflowStep.create({ data: args });
    },
    updateWorkflowStep: async (_: any, { step_id, ...args }: { step_id: string, [key: string]: any }) => {
      return prisma.workflowStep.update({
        where: { step_id: parseInt(step_id) },
        data: args,
      });
    },
    deleteWorkflowStep: async (_: any, { step_id }: { step_id: string }) => {
      await prisma.workflowStep.delete({ where: { step_id: parseInt(step_id) } });
      return true;
    },
  },
};