import prisma from '@/lib/prisma';

export const leadResolvers = {
  Query: {
    leads: async () => {
      return prisma.lead.findMany();
    },
    lead: async (_: any, { lead_id }: { lead_id: string }) => {
      return prisma.lead.findUnique({ where: { lead_id: parseInt(lead_id) } });
    },
  },
  Mutation: {
    addLead: async (_: any, args: any) => {
      return prisma.lead.create({ data: args });
    },
    updateLead: async (_: any, { lead_id, ...args }: { lead_id: string, [key: string]: any }) => {
      return prisma.lead.update({
        where: { lead_id: parseInt(lead_id) },
        data: args,
      });
    },
    deleteLead: async (_: any, { lead_id }: { lead_id: string }) => {
      await prisma.lead.delete({ where: { lead_id: parseInt(lead_id) } });
      return true;
    },
  },
};