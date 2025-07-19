import prisma from '@/lib/prisma';

export const campaignResolvers = {
  Query: {
    campaigns: async () => {
      return prisma.campaign.findMany();
    },
    campaign: async (_: any, { campaign_id }: { campaign_id: string }) => {
      return prisma.campaign.findUnique({ where: { campaign_id: parseInt(campaign_id) } });
    },
  },
  Mutation: {
    addCampaign: async (_: any, args: any) => {
      return prisma.campaign.create({ data: args });
    },
    updateCampaign: async (_: any, { campaign_id, ...args }: { campaign_id: string, [key: string]: any }) => {
      return prisma.campaign.update({
        where: { campaign_id: parseInt(campaign_id) },
        data: args,
      });
    },
    deleteCampaign: async (_: any, { campaign_id }: { campaign_id: string }) => {
      await prisma.campaign.delete({ where: { campaign_id: parseInt(campaign_id) } });
      return true;
    },
  },
};