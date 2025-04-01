import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import Navbar from './Navbar';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const Home = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [todos, setTodos] = useState([]);
  // For inline editing
  const [editingTodo, setEditingTodo] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  // Create a new todo
  const addTodoHandler = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/todo",
        { title, description },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        // Append the new todo to the list
        setTodos([...todos, res.data.todo]);
        setTitle('');
        setDescription('');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error adding todo");
    }
  };

  // In Home.jsx fetchTodos method
const fetchTodos = async () => {
  try {
    const res = await axios.get("http://localhost:8000/api/v1/todo", { 
      withCredentials: true 
    });
    if (res.data.success) {
      // Merge existing local todos with fresh database todos
      setTodos(prevTodos => {
        const mergedTodos = [...prevTodos];
        res.data.todos.forEach(dbTodo => {
          if (!mergedTodos.some(localTodo => localTodo._id === dbTodo._id)) {
            mergedTodos.push(dbTodo);
          }
        });
        return mergedTodos;
      });
    }
  } catch (error) {
    console.log("Error in fetchTodos", error);
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = '/login';
    }
  }
};


  // Home.jsx
useEffect(() => {
  fetchTodos();
}, []);

  // Delete a todo by its ID
  const deleteTodoHandler = async (todoId) => {
    try {
      const res = await axios.delete(`http://localhost:8000/api/v1/todo/${todoId}`, {
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success(res.data.message);
        setTodos(todos.filter(todo => todo._id !== todoId));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting todo");
    }
  };

  // Set a todo into editing mode
  const startEditing = (todo) => {
    setEditingTodo(todo._id);
    setEditTitle(todo.title);
    setEditDescription(todo.description);
  };

  // Cancel editing mode
  const cancelEditing = () => {
    setEditingTodo(null);
    setEditTitle('');
    setEditDescription('');
  };

  // Update a todo with new title and description
  const updateTodoHandler = async (todoId) => {
    try {
      const res = await axios.put(
        `http://localhost:8000/api/v1/todo/${todoId}`,
        { title: editTitle, description: editDescription },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        // Update the todo in local state
        setTodos(todos.map(todo =>
          todo._id === todoId ? { ...todo, title: editTitle, description: editDescription } : todo
        ));
        cancelEditing();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating todo");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <Navbar />
      <div className="max-w-4xl mx-auto mt-8 space-y-8">
        {/* Professional Add Todo Form */}
        <Card className="shadow-2xl">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 rounded-t-lg">
            <CardTitle className="text-2xl font-bold">Add New Todo</CardTitle>
            <CardDescription>Enter your todo details below</CardDescription>
          </CardHeader>
          <CardContent className="p-6 bg-white rounded-b-lg">
            <div className="flex flex-col gap-4">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                type="text"
                placeholder="Todo title..."
                className="border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Todo description..."
                className="border border-gray-300 p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button
                onClick={addTodoHandler}
                className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 transition"
              >
                Add Todo +
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Todos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(todos) && todos.map((todo) => (
            <Card key={todo._id} className="shadow-lg">
              <CardHeader className="bg-white p-4">
                {editingTodo === todo._id ? (
                  <div className="flex flex-col gap-2">
                    <Input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      placeholder="Edit title"
                      className="border p-2 rounded"
                    />
                    <Textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      placeholder="Edit description"
                      className="border p-2 rounded"
                    />
                  </div>
                ) : (
                  <div className="flex flex-col">
                    <CardTitle className="text-xl font-bold">{todo.title}</CardTitle>
                    <CardDescription className="text-gray-600">{todo.description}</CardDescription>
                  </div>
                )}
              </CardHeader>
              <div className="flex justify-end gap-2 p-4 bg-gray-50">
                {editingTodo === todo._id ? (
                  <>
                    <Button
                      onClick={() => updateTodoHandler(todo._id)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                    >
                      Update
                    </Button>
                    <Button
                      onClick={cancelEditing}
                      className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 transition"
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={() => startEditing(todo)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => deleteTodoHandler(todo._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                    >
                      Delete
                    </Button>
                  </>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
