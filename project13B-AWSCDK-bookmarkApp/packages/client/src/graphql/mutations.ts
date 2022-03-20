/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createBookmark = /* GraphQL */ `
  mutation CreateBookmark($title: String!, $url: String!) {
    createBookmark(title: $title, url: $url) {
      id
      title
      url
    }
  }
`;
export const deleteBookmark = /* GraphQL */ `
  mutation DeleteBookmark($id: String!) {
    deleteBookmark(id: $id) {
      id
      title
      url
    }
  }
`;
export const updateBookmark = /* GraphQL */ `
  mutation UpdateBookmark($id: String!, $title: String!, $url: String!) {
    updateBookmark(id: $id, title: $title, url: $url) {
      id
      title
      url
    }
  }
`;
