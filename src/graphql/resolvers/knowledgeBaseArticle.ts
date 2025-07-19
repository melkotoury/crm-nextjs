import prisma from '@/lib/prisma';

export const knowledgeBaseArticleResolvers = {
  Query: {
    knowledgeBaseArticles: async () => {
      return prisma.knowledgeBaseArticle.findMany();
    },
    knowledgeBaseArticle: async (_: any, { article_id }: { article_id: string }) => {
      return prisma.knowledgeBaseArticle.findUnique({ where: { article_id: parseInt(article_id) } });
    },
  },
  Mutation: {
    addKnowledgeBaseArticle: async (_: any, args: any) => {
      return prisma.knowledgeBaseArticle.create({ data: args });
    },
    updateKnowledgeBaseArticle: async (_: any, { article_id, ...args }: { article_id: string, [key: string]: any }) => {
      return prisma.knowledgeBaseArticle.update({
        where: { article_id: parseInt(article_id) },
        data: args,
      });
    },
    deleteKnowledgeBaseArticle: async (_: any, { article_id }: { article_id: string }) => {
      await prisma.knowledgeBaseArticle.delete({ where: { article_id: parseInt(article_id) } });
      return true;
    },
  },
};