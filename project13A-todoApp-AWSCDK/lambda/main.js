"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const allTodos_1 = require("./allTodos");
const createTodo_1 = require("./createTodo");
exports.handler = async (event) => {
    switch (event.info.fieldName) {
        case "allTodos":
            return await allTodos_1.allTodos();
        case "createTodo":
            return await createTodo_1.createTodo(event.arguments.todo);
        case "deleteTodo":
            return;
        default:
            return null;
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm1haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx5Q0FBcUM7QUFDckMsNkNBQXlDO0FBYXpDLE9BQU8sQ0FBQyxPQUFPLEdBQUcsS0FBSyxFQUFDLEtBQW1CLEVBQUUsRUFBRTtJQUMzQyxRQUFPLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFDO1FBQ3hCLEtBQUssVUFBVTtZQUNYLE9BQU8sTUFBTSxtQkFBUSxFQUFFLENBQUM7UUFDNUIsS0FBSyxZQUFZO1lBQ2IsT0FBTyxNQUFNLHVCQUFVLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUNqRCxLQUFLLFlBQVk7WUFDYixPQUFNO1FBQ1Y7WUFDSSxPQUFPLElBQUksQ0FBQztLQUNuQjtBQUNMLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGFsbFRvZG9zIH0gZnJvbSBcIi4vYWxsVG9kb3NcIlxyXG5pbXBvcnQgeyBjcmVhdGVUb2RvIH0gZnJvbSBcIi4vY3JlYXRlVG9kb1wiXHJcbmltcG9ydCB7IFRvZG8gfSBmcm9tIFwiLi9Ub2RvXCJcclxuXHJcbnR5cGUgQXBwU3luY0V2ZW50ID0ge1xyXG4gICAgaW5mbzoge1xyXG4gICAgICAgIGZpZWxkTmFtZTogc3RyaW5nXHJcbiAgICB9XHJcbiAgICBhcmd1bWVudHM6IHtcclxuICAgICAgICB0b2RvOiBUb2RvXHJcbiAgICAgICAgaWQ6IHN0cmluZ1xyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnRzLmhhbmRsZXIgPSBhc3luYyhldmVudDogQXBwU3luY0V2ZW50KSA9PiB7XHJcbiAgICBzd2l0Y2goZXZlbnQuaW5mby5maWVsZE5hbWUpe1xyXG4gICAgICAgIGNhc2UgXCJhbGxUb2Rvc1wiOlxyXG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgYWxsVG9kb3MoKTtcclxuICAgICAgICBjYXNlIFwiY3JlYXRlVG9kb1wiOlxyXG4gICAgICAgICAgICByZXR1cm4gYXdhaXQgY3JlYXRlVG9kbyhldmVudC5hcmd1bWVudHMudG9kbylcclxuICAgICAgICBjYXNlIFwiZGVsZXRlVG9kb1wiOlxyXG4gICAgICAgICAgICByZXR1cm5cclxuICAgICAgICBkZWZhdWx0OiBcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbn0iXX0=