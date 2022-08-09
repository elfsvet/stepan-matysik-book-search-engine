import { gql } from '@apollo/client';
// creating and exporting it in one step the query call to execute the me query using apollo server
export const GET_ME = gql`
query Query {
    me {
      _id
      username
      email
      bookCount
      savedBooks {
        bookId
        authors
        description
        title
        image
        link
      }
    }
  }
`;
