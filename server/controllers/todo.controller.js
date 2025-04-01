import { Todo } from "../models/todo.model.js";

// Create Todo: Attach the authenticated user's ID when saving
export const createTodo = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required.',
      });
    }
    // Attach the user ID from authentication middleware (req.id)
    const todo = new Todo({ title, description, user: req.id });
    await todo.save();

    return res.status(201).json({
      success: true,
      message: 'Todo created',
      todo,
    });
  } catch (error) {
    console.log(`Error in createTodo`, error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Get All Todos: Return only the todos belonging to the logged-in user
export const getAllTodos = async (req, res) => {
  try {
    // Filter todos by the authenticated user's ID
    const todos = await Todo.find({ user: req.id });
    return res.status(200).json({
      success: true,
      todos,
    });
  } catch (error) {
    console.log(`Error in getAllTodos in todo controller`, error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};

// Update Todo: Only update if the todo belongs to the authenticated user
export const updateTodo = async (req, res) => {
  try {
    const todoId = req.params.todoId;
    const { title, description } = req.body;

    // Find and update only if the todo belongs to req.id
    const todo = await Todo.findOneAndUpdate(
      { _id: todoId, user: req.id },
      { title, description },
      { new: true }
    );
    
    if (!todo) {
      return res.status(404).json({
        success: false,
        message: "Todo not found or unauthorized",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Todo updated",
      todo,
    });
  } catch (error) {
    console.log(`Error in updateTodo controller`, error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Delete Todo: Only delete if the todo belongs to the authenticated user
export const deleteTodo = async (req, res) => {
  try {
    const todoId = req.params.todoId;
    // Find the todo ensuring it belongs to the current user
    const todo = await Todo.findOne({ _id: todoId, user: req.id });
    if (!todo) {
      return res.status(404).json({
        success: false,
        message: 'Todo not found or unauthorized',
      });
    }
    await Todo.findByIdAndDelete(todoId);
    return res.status(200).json({
      success: true,
      message: 'Todo deleted successfully',
    });
  } catch (error) {
    console.log(`Error in deleteTodo`, error);
    return res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
};
