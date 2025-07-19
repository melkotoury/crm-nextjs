import prisma from '@/lib/prisma';

export const reportResolvers = {
  Query: {
    reports: async () => {
      return prisma.report.findMany();
    },
    report: async (_: any, { report_id }: { report_id: string }) => {
      return prisma.report.findUnique({ where: { report_id: parseInt(report_id) } });
    },
  },
  Mutation: {
    addReport: async (_: any, args: any) => {
      return prisma.report.create({ data: args });
    },
    updateReport: async (_: any, { report_id, ...args }: { report_id: string, [key: string]: any }) => {
      return prisma.report.update({
        where: { report_id: parseInt(report_id) },
        data: args,
      });
    },
    deleteReport: async (_: any, { report_id }: { report_id: string }) => {
      await prisma.report.delete({ where: { report_id: parseInt(report_id) } });
      return true;
    },
  },
};