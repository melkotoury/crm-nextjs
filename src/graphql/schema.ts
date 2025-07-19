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

  type Query {
    hello: String
    contacts: [Contact]
    leads: [Lead]
    deals: [Deal]
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
    opportunities: async () => {
      const { rows } = await pool.query('SELECT * FROM opportunities');
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
  },
};