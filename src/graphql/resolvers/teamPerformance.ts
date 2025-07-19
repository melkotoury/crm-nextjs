import prisma from '@/lib/prisma';

export const teamPerformanceResolvers = {
  Query: {
    teamPerformance: async () => {
      return prisma.teamPerformance.findMany();
    },
    teamPerformanceRecord: async (_: any, { performance_id }: { performance_id: string }) => {
      return prisma.teamPerformance.findUnique({ where: { performance_id: parseInt(performance_id) } });
    },
  },
  Mutation: {
    addTeamPerformance: async (_: any, args: any) => {
      return prisma.teamPerformance.create({ data: args });
    },
    updateTeamPerformance: async (_: any, { performance_id, ...args }: { performance_id: string, [key: string]: any }) => {
      return prisma.teamPerformance.update({
        where: { performance_id: parseInt(performance_id) },
        data: args,
      });
    },
    deleteTeamPerformance: async (_: any, { performance_id }: { performance_id: string }) => {
      await prisma.teamPerformance.delete({ where: { performance_id: parseInt(performance_id) } });
      return true;
    },
  },
};