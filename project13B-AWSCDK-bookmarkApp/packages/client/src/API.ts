/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type Bookmark = {
  __typename: "Bookmark",
  id: string,
  title: string,
  url: string,
};

export type CreateBookmarkMutationVariables = {
  title: string,
  url: string,
};

export type CreateBookmarkMutation = {
  createBookmark?:  {
    __typename: "Bookmark",
    id: string,
    title: string,
    url: string,
  } | null,
};

export type DeleteBookmarkMutationVariables = {
  id: string,
};

export type DeleteBookmarkMutation = {
  deleteBookmark?:  {
    __typename: "Bookmark",
    id: string,
    title: string,
    url: string,
  } | null,
};

export type UpdateBookmarkMutationVariables = {
  id: string,
  title: string,
  url: string,
};

export type UpdateBookmarkMutation = {
  updateBookmark?:  {
    __typename: "Bookmark",
    id: string,
    title: string,
    url: string,
  } | null,
};

export type BookmarksQuery = {
  bookmarks?:  Array< {
    __typename: "Bookmark",
    id: string,
    title: string,
    url: string,
  } > | null,
};
