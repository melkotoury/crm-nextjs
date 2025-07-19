import prisma from '@/lib/prisma';

export const integrationResolvers = {
  Query: {
    integrations: async () => {
      return prisma.integration.findMany();
    },
    integration: async (_: any, { integration_id }: { integration_id: string }) => {
      return prisma.integration.findUnique({ where: { integration_id: parseInt(integration_id) } });
    },
  },
  Mutation: {
    addIntegration: async (_: any, args: any) => {
      return prisma.integration.create({ data: args });
    },
    updateIntegration: async (_: any, { integration_id, ...args }: { integration_id: string, [key: string]: any }) => {
      return prisma.integration.update({
        where: { integration_id: parseInt(integration_id) },
        data: args,
      });
    },
    deleteIntegration: async (_: any, { integration_id }: { integration_id: string }) => {
      await prisma.integration.delete({ where: { integration_id: parseInt(integration_id) } });
      return true;
    },
  },
};