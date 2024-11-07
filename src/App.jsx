import React, { useState, useReducer } from 'react';
import { useImmerReducer } from 'use-immer';
import './App.css';

// Define action types
const ACTIONS = {
  ADD_TODO: 'add-todo',
  TOGGLE_TODO: 'toggle-todo',
  DELETE_TODO: 'delete-todo',
  EDIT_TODO: 'edit-todo',
  SAVE_TODO: 'save-todo',
};

// Define the reducer function using immer
const todoReducer = (draft, action) => {
  switch (action.type) {
    case ACTIONS.ADD_TODO:
      draft.todos.unshift({
        id: Date.now(),
        text: action.text,
        isComplete: false,
        isEditing: false,
      });
      break;
    case ACTIONS.TOGGLE_TODO:
      const todo = draft.todos.find(todo => todo.id === action.id);
      if (todo) {
        todo.isComplete = !todo.isComplete;
      }
      break;
    case ACTIONS.DELETE_TODO:
      draft.todos = draft.todos.filter(todo => todo.id !== action.id);
      break;
    case ACTIONS.EDIT_TODO:
      const todoToEdit = draft.todos.find(todo => todo.id === action.id);
      if (todoToEdit) {
        todoToEdit.isEditing = true;
      }
      break;
    case ACTIONS.SAVE_TODO:
      const todoToSave = draft.todos.find(todo => todo.id === action.id);
      if (todoToSave) {
        todoToSave.text = action.text;
        todoToSave.isEditing = false;
      }
      break;
    default:
      break;
  }
};

const TodoItem = ({ todo, dispatch }) => {
  const [newTodoText, setNewTodoText] = useState(todo.text);

  const handleSave = () => {
    dispatch({ type: ACTIONS.SAVE_TODO, id: todo.id, text: newTodoText });
  };

  return (
    <div className="todo-item">
      {todo.isEditing ? (
        <input
          type="text"
          value={newTodoText}
          onChange={(e) => setNewTodoText(e.target.value)}
        />
      ) : (
        <span
          style={{ textDecoration: todo.isComplete ? 'line-through' : 'none' }}
        >
          {todo.text}
        </span>
      )}
      <input
        type="checkbox"
        checked={todo.isComplete}
        onChange={() => dispatch({ type: ACTIONS.TOGGLE_TODO, id: todo.id })}
      />
      {todo.isEditing ? (
        <button onClick={handleSave}>Save</button>
      ) : (
        <>
          <button onClick={() => dispatch({ type: ACTIONS.EDIT_TODO, id: todo.id })}>
            Edit
          </button>
          <button
            onClick={() => dispatch({ type: ACTIONS.DELETE_TODO, id: todo.id })}
            disabled={!todo.isComplete}
          >
            Delete
          </button>
        </>
      )}
    </div>
  );
};

const TodoList = () => {
  const [newTodo, setNewTodo] = useState('');
  const [state, dispatch] = useImmerReducer(todoReducer, { todos: [] });

  const addTodo = () => {
    if (newTodo.trim()) {
      dispatch({ type: ACTIONS.ADD_TODO, text: newTodo });
      setNewTodo('');
    }
  };

  return (
    <div className="todo-list">
      <h1>Todo List</h1>
      <div>
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Enter new todo"
        />
        <button onClick={addTodo}>Add Todo</button>
      </div>

      <div>
        {state.todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} dispatch={dispatch} />
        ))}
      </div>
    </div>
  );
};

export default TodoList;
