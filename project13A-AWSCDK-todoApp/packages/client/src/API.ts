/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type TodoInput = {
  id: string,
  title: string,
  checked: boolean,
};

export type Todo = {
  __typename: "Todo",
  id: string,
  title: string,
  checked: boolean,
};

export type CreateTodoMutationVariables = {
  todo: TodoInput,
};

export type CreateTodoMutation = {
  createTodo?:  {
    __typename: "Todo",
    id: string,
    title: string,
    checked: boolean,
  } | null,
};

export type DeleteTodoMutationVariables = {
  id: string,
};

export type DeleteTodoMutation = {
  deleteTodo?:  {
    __typename: "Todo",
    id: string,
    title: string,
    checked: boolean,
  } | null,
};

export type AllTodosQuery = {
  allTodos?:  Array< {
    __typename: "Todo",
    id: string,
    title: string,
    checked: boolean,
  } | null > | null,
};
