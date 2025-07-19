import prisma from '@/lib/prisma';

export const territoryResolvers = {
  Query: {
    territories: async () => {
      return prisma.territory.findMany();
    },
    territory: async (_: any, { territory_id }: { territory_id: string }) => {
      return prisma.territory.findUnique({ where: { territory_id: parseInt(territory_id) } });
    },
  },
  Mutation: {
    addTerritory: async (_: any, args: any) => {
      return prisma.territory.create({ data: args });
    },
    updateTerritory: async (_: any, { territory_id, ...args }: { territory_id: string, [key: string]: any }) => {
      return prisma.territory.update({
        where: { territory_id: parseInt(territory_id) },
        data: args,
      });
    },
    deleteTerritory: async (_: any, { territory_id }: { territory_id: string }) => {
      await prisma.territory.delete({ where: { territory_id: parseInt(territory_id) } });
      return true;
    },
  },
};