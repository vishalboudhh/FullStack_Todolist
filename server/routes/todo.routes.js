import express from 'express';
import { createTodo, deleteTodo, getAllTodos, updateTodo } from '../controllers/todo.controller.js';
import isAuthenticated from '../middleware/isAuthenticated.js';

const router = express.Router();

router.route('/').post(isAuthenticated,createTodo).get(isAuthenticated,getAllTodos);
router.route('/:todoId').put(isAuthenticated,updateTodo).delete(isAuthenticated,deleteTodo);

export default router;