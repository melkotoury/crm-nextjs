import prisma from '@/lib/prisma';

export const auditLogResolvers = {
  Query: {
    auditLogs: async () => {
      return prisma.auditLog.findMany();
    },
    auditLog: async (_: any, { log_id }: { log_id: string }) => {
      return prisma.auditLog.findUnique({ where: { log_id: parseInt(log_id) } });
    },
  },
  Mutation: {
    addAuditLog: async (_: any, args: any) => {
      return prisma.auditLog.create({ data: args });
    },
    // No update or delete for audit logs, as they should be immutable
  },
};