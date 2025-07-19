import prisma from '@/lib/prisma';

export const customerLifetimeValueResolvers = {
  Query: {
    customerLifetimeValues: async () => {
      return prisma.customerLifetimeValue.findMany();
    },
    customerLifetimeValue: async (_: any, { clv_id }: { clv_id: string }) => {
      return prisma.customerLifetimeValue.findUnique({ where: { clv_id: parseInt(clv_id) } });
    },
  },
  Mutation: {
    addCustomerLifetimeValue: async (_: any, args: any) => {
      return prisma.customerLifetimeValue.create({ data: args });
    },
    updateCustomerLifetimeValue: async (_: any, { clv_id, ...args }: { clv_id: string, [key: string]: any }) => {
      return prisma.customerLifetimeValue.update({
        where: { clv_id: parseInt(clv_id) },
        data: args,
      });
    },
    deleteCustomerLifetimeValue: async (_: any, { clv_id }: { clv_id: string }) => {
      await prisma.customerLifetimeValue.delete({ where: { clv_id: parseInt(clv_id) } });
      return true;
    },
  },
};