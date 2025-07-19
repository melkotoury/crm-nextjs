import prisma from '@/lib/prisma';

export const proposalResolvers = {
  Query: {
    proposals: async () => {
      return prisma.proposal.findMany();
    },
    proposal: async (_: any, { proposal_id }: { proposal_id: string }) => {
      return prisma.proposal.findUnique({ where: { proposal_id: parseInt(proposal_id) } });
    },
  },
  Mutation: {
    addProposal: async (_: any, args: any) => {
      return prisma.proposal.create({ data: args });
    },
    updateProposal: async (_: any, { proposal_id, ...args }: { proposal_id: string, [key: string]: any }) => {
      return prisma.proposal.update({
        where: { proposal_id: parseInt(proposal_id) },
        data: args,
      });
    },
    deleteProposal: async (_: any, { proposal_id }: { proposal_id: string }) => {
      await prisma.proposal.delete({ where: { proposal_id: parseInt(proposal_id) } });
      return true;
    },
  },
};