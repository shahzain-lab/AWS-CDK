/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createLolly = /* GraphQL */ `
  mutation CreateLolly(
    $recName: String!
    $message: String!
    $senderName: String!
    $flavorTop: String!
    $flavorMiddle: String!
    $flavorBottom: String!
  ) {
    createLolly(
      recName: $recName
      message: $message
      senderName: $senderName
      flavorTop: $flavorTop
      flavorMiddle: $flavorMiddle
      flavorBottom: $flavorBottom
    ) {
      recName
      message
      senderName
      flavorTop
      flavorMiddle
      flavorBottom
      slug
    }
  }
`;
