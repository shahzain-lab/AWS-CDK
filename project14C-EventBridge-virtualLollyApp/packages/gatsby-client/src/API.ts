/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type Lolly = {
  __typename: "Lolly",
  recName: string,
  message: string,
  senderName: string,
  flavorTop: string,
  flavorMiddle: string,
  flavorBottom: string,
  slug: string,
};

export type CreateLollyMutationVariables = {
  recName: string,
  message: string,
  senderName: string,
  flavorTop: string,
  flavorMiddle: string,
  flavorBottom: string,
};

export type CreateLollyMutation = {
  createLolly?:  {
    __typename: "Lolly",
    recName: string,
    message: string,
    senderName: string,
    flavorTop: string,
    flavorMiddle: string,
    flavorBottom: string,
    slug: string,
  } | null,
};

export type AllLolliesQuery = {
  allLollies:  Array< {
    __typename: "Lolly",
    recName: string,
    message: string,
    senderName: string,
    flavorTop: string,
    flavorMiddle: string,
    flavorBottom: string,
    slug: string,
  } | null >,
};
