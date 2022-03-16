/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createTodo = /* GraphQL */ `
  mutation CreateTodo($todo: TodoInput!) {
    createTodo(todo: $todo) {
      id
      title
      checked
    }
  }
`;
export const deleteTodo = /* GraphQL */ `
  mutation DeleteTodo($id: String!) {
    deleteTodo(id: $id) {
      id
      title
      checked
    }
  }
`;
