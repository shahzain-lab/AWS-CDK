import { DynamoDB } from 'aws-sdk';
export declare const allTodos: () => Promise<string | DynamoDB.DocumentClient.ItemList | undefined>;
