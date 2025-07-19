import prisma from '@/lib/prisma';

export const quoteResolvers = {
  Query: {
    quotes: async () => {
      return prisma.quote.findMany();
    },
    quote: async (_: any, { quote_id }: { quote_id: string }) => {
      return prisma.quote.findUnique({ where: { quote_id: parseInt(quote_id) } });
    },
  },
  Mutation: {
    addQuote: async (_: any, args: any) => {
      return prisma.quote.create({ data: args });
    },
    updateQuote: async (_: any, { quote_id, ...args }: { quote_id: string, [key: string]: any }) => {
      return prisma.quote.update({
        where: { quote_id: parseInt(quote_id) },
        data: args,
      });
    },
    deleteQuote: async (_: any, { quote_id }: { quote_id: string }) => {
      await prisma.quote.delete({ where: { quote_id: parseInt(quote_id) } });
      return true;
    },
  },
};