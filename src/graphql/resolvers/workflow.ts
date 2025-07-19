import prisma from '@/lib/prisma';

export const workflowResolvers = {
  Query: {
    workflows: async () => {
      return prisma.workflow.findMany();
    },
    workflow: async (_: any, { workflow_id }: { workflow_id: string }) => {
      return prisma.workflow.findUnique({ where: { workflow_id: parseInt(workflow_id) } });
    },
  },
  Mutation: {
    addWorkflow: async (_: any, args: any) => {
      return prisma.workflow.create({ data: args });
    },
    updateWorkflow: async (_: any, { workflow_id, ...args }: { workflow_id: string, [key: string]: any }) => {
      return prisma.workflow.update({
        where: { workflow_id: parseInt(workflow_id) },
        data: args,
      });
    },
    deleteWorkflow: async (_: any, { workflow_id }: { workflow_id: string }) => {
      await prisma.workflow.delete({ where: { workflow_id: parseInt(workflow_id) } });
      return true;
    },
  },
};