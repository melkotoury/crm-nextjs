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

  type Query {
    contacts: [Contact]
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
  }
`;

export const resolvers = {
  Query: {
    contacts: async () => {
      const { rows } = await pool.query('SELECT * FROM contacts');
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
  },
};
