import { gql } from 'graphql-tag';
import pool from '@/db';

export const typeDefs = gql`
  type Contact {
    contact_id: ID!
    first_name: String!
    last_name: String!
    email: String!
    phone_number: String
    company: String
    job_title: String
  }

  type Lead {
    lead_id: ID!
    first_name: String!
    last_name: String!
    email: String!
    company: String
    status: String!
    source: String
  }

  type Deal {
    deal_id: ID!
    deal_name: String!
    stage: String!
    amount: Float
    close_date: String
    contact_id: ID
    user_id: ID
  }

  type Campaign {
    campaign_id: ID!
    campaign_name: String!
    start_date: String
    end_date: String
    budget: Float
    status: String
  }

  type Email {
    email_id: ID!
    campaign_id: ID
    subject: String!
    body: String
    sent_date: String
    recipient_count: Int
    open_rate: Float
    click_through_rate: Float
  }

  type SocialPost {
    post_id: ID!
    campaign_id: ID
    platform: String!
    content: String!
    post_date: String
    likes: Int
    shares: Int
    comments: Int
  }

  type Ticket {
    ticket_id: ID!
    subject: String!
    description: String
    status: String
    priority: String
    contact_id: ID
    user_id: ID
  }

  type KnowledgeBaseArticle {
    article_id: ID!
    title: String!
    content: String
    category: String
  }

  type Report {
    report_id: ID!
    report_name: String!
    report_type: String
    generated_date: String
    data: String
  }

  type Dashboard {
    dashboard_id: ID!
    dashboard_name: String!
    layout: String
  }

  type Query {
    hello: String
    contacts: [Contact]
    leads: [Lead]
    deals: [Deal]
    campaigns: [Campaign]
    emails: [Email]
    socialPosts: [SocialPost]
    tickets: [Ticket]
    knowledgeBaseArticles: [KnowledgeBaseArticle]
    reports: [Report]
    dashboards: [Dashboard]
  }

  type Mutation {
    addContact(
      first_name: String!
      last_name: String!
      email: String!
      phone_number: String
      company: String
      job_title: String
    ): Contact
    addLead(
      first_name: String!
      last_name: String!
      email: String!
      company: String
      status: String!
      source: String
    ): Lead
    addDeal(
      deal_name: String!
      stage: String!
      amount: Float
      close_date: String
      contact_id: ID
      user_id: ID
    ): Deal
    addCampaign(
      campaign_name: String!
      start_date: String
      end_date: String
      budget: Float
      status: String
    ): Campaign
    addEmail(
      campaign_id: ID
      subject: String!
      body: String
      sent_date: String
      recipient_count: Int
      open_rate: Float
      click_through_rate: Float
    ): Email
    addSocialPost(
      campaign_id: ID
      platform: String!
      content: String!
      post_date: String
      likes: Int
      shares: Int
      comments: Int
    ): SocialPost
    addTicket(
      subject: String!
      description: String
      status: String
      priority: String
      contact_id: ID
      user_id: ID
    ): Ticket
    addKnowledgeBaseArticle(
      title: String!
      content: String
      category: String
    ): KnowledgeBaseArticle
    addReport(
      report_name: String!
      report_type: String
      generated_date: String
      data: String
    ): Report
    addDashboard(
      dashboard_name: String!
      layout: String
    ): Dashboard
  }
`;

export const resolvers = {
  Query: {
    hello: () => 'Hello, world!',
    contacts: async () => {
      const { rows } = await pool.query('SELECT * FROM contacts');
      return rows;
    },
    leads: async () => {
      const { rows } = await pool.query('SELECT * FROM leads');
      return rows;
    },
    deals: async () => {
      const { rows } = await pool.query('SELECT * FROM deals');
      return rows;
    },
    campaigns: async () => {
      const { rows } = await pool.query('SELECT * FROM campaigns');
      return rows;
    },
    emails: async () => {
      const { rows } = await pool.query('SELECT * FROM emails');
      return rows;
    },
    socialPosts: async () => {
      const { rows } = await pool.query('SELECT * FROM social_posts');
      return rows;
    },
    tickets: async () => {
      const { rows } = await pool.query('SELECT * FROM tickets');
      return rows;
    },
    knowledgeBaseArticles: async () => {
      const { rows } = await pool.query('SELECT * FROM knowledge_base_articles');
      return rows;
    },
    reports: async () => {
      const { rows } = await pool.query('SELECT * FROM reports');
      return rows;
    },
    dashboards: async () => {
      const { rows } = await pool.query('SELECT * FROM dashboards');
      return rows;
    },
  },
  Mutation: {
    addContact: async (_: any, args: any) => {
      const { first_name, last_name, email, phone_number, company, job_title } = args;
      const { rows } = await pool.query(
        'INSERT INTO contacts (first_name, last_name, email, phone_number, company, job_title) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [first_name, last_name, email, phone_number, company, job_title]
      );
      return rows[0];
    },
    addLead: async (_: any, args: any) => {
      const { first_name, last_name, email, company, status, source } = args;
      const { rows } = await pool.query(
        'INSERT INTO leads (first_name, last_name, email, company, status, source) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [first_name, last_name, email, company, status, source]
      );
      return rows[0];
    },
    addDeal: async (_: any, args: any) => {
      const { deal_name, stage, amount, close_date, contact_id, user_id } = args;
      const { rows } = await pool.query(
        'INSERT INTO deals (deal_name, stage, amount, close_date, contact_id, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [deal_name, stage, amount, close_date, contact_id, user_id]
      );
      return rows[0];
    },
    addCampaign: async (_: any, args: any) => {
      const { campaign_name, start_date, end_date, budget, status } = args;
      const { rows } = await pool.query(
        'INSERT INTO campaigns (campaign_name, start_date, end_date, budget, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [campaign_name, start_date, end_date, budget, status]
      );
      return rows[0];
    },
    addEmail: async (_: any, args: any) => {
      const { campaign_id, subject, body, sent_date, recipient_count, open_rate, click_through_rate } = args;
      const { rows } = await pool.query(
        'INSERT INTO emails (campaign_id, subject, body, sent_date, recipient_count, open_rate, click_through_rate) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [campaign_id, subject, body, sent_date, recipient_count, open_rate, click_through_rate]
      );
      return rows[0];
    },
    addSocialPost: async (_: any, args: any) => {
      const { campaign_id, platform, content, post_date, likes, shares, comments } = args;
      const { rows } = await pool.query(
        'INSERT INTO social_posts (campaign_id, platform, content, post_date, likes, shares, comments) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
        [campaign_id, platform, content, post_date, likes, shares, comments]
      );
      return rows[0];
    },
    addTicket: async (_: any, args: any) => {
      const { subject, description, status, priority, contact_id, user_id } = args;
      const { rows } = await pool.query(
        'INSERT INTO tickets (subject, description, status, priority, contact_id, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [subject, description, status, priority, contact_id, user_id]
      );
      return rows[0];
    },
    addKnowledgeBaseArticle: async (_: any, args: any) => {
      const { title, content, category } = args;
      const { rows } = await pool.query(
        'INSERT INTO knowledge_base_articles (title, content, category) VALUES ($1, $2, $3) RETURNING *',
        [title, content, category]
      );
      return rows[0];
    },
    addReport: async (_: any, args: any) => {
      const { report_name, report_type, generated_date, data } = args;
      const { rows } = await pool.query(
        'INSERT INTO reports (report_name, report_type, generated_date, data) VALUES ($1, $2, $3, $4) RETURNING *',
        [report_name, report_type, generated_date, data]
      );
      return rows[0];
    },
    addDashboard: async (_: any, args: any) => {
      const { dashboard_name, layout } = args;
      const { rows } = await pool.query(
        'INSERT INTO dashboards (dashboard_name, layout) VALUES ($1, $2) RETURNING *',
        [dashboard_name, layout]
      );
      return rows[0];
    },
  },
};
