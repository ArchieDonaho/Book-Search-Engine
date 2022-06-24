// TODO queries.js: This will hold the query GET_ME, which will execute the me query set up using Apollo Server.
import { gql } from '@apollo/client';

export const GET_ME = gql`
  {
    me {
      _id: ID
      username: String
      email: String
      bookCount: Int
      savedBooks: {
        bookId: String
        authors: [String]
        description: String
        title: String
        image: String
        link: String
      }
    }
  }
`;
