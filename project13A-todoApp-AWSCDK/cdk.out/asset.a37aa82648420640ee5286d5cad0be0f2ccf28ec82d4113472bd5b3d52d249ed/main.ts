import { allTodos } from "./allTodos"
import { createTodo } from "./createTodo"
import { deleteTodo } from "./deleteTodo"
import { Todo } from "./Todo"

type AppSyncEvent = {
    info: {
        fieldName: string
    }
    arguments: {
        todo: Todo
        id: string
    }
}

exports.handler = async(event: AppSyncEvent) => {
    switch(event.info.fieldName){
        case "allTodos":
            return await allTodos();
        case "createTodo":
            return await createTodo(event.arguments.todo)
        case "deleteTodo":
            return await deleteTodo(event.arguments.id)
        default: 
            return null;
    }
}