import React, { useState, useEffect } from 'react';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

const Index: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const savedTodos = localStorage.getItem('todos');
    return savedTodos ? JSON.parse(savedTodos) : [];
  });
  const [input, setInput] = useState<string>('');
  const [filter, setFilter] = useState<string>('All');

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && input.trim()) {
      setTodos([...todos, { id: Date.now(), text: input.trim(), completed: false }]);
      setInput('');
    }
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const clearAll = () => {
    setTodos([]);
    localStorage.removeItem('todos');
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'Active') return !todo.completed;
    if (filter === 'Complete') return todo.completed;
    return true;
  });

  return (
    <div className='relative h-screen'>
      <div className='flex flex-col items-center border h-full pt-20 gap-4'>
        <h1 className='text-2xl text-white text-left font-bold'>TO DO</h1>
        <input
          type="text"
          placeholder="Create a to do..."
          className="bg-white w-80 lg:w-1/4 h-15 ps-10 rounded-md"
          value={input}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
          onKeyPress={addTodo}
        />
        <div className="bg-white w-80 lg:w-1/4 rounded-md flex justify-between items-center border-b p-2">
          <p className="text-xs md:text-sm xl:text-base">
            {todos.filter(todo => !todo.completed).length} items left
          </p>
          <ul className="flex flex-row justify-between items-center p-1 w-32 md:w-33 lg:w-37 xl:w-2/4">
            <li
              className={`cursor-pointer text-xs md:text-sm xl:text-base ${filter === 'All' ? 'font-bold text-blue-700' : ''}`}
              onClick={() => setFilter('All')}
            >
              All
            </li>
            <li
              className={`cursor-pointer text-xs md:text-sm xl:text-base ${filter === 'Active' ? 'font-bold text-blue-700' : ''}`}
              onClick={() => setFilter('Active')}
            >
              Active
            </li>
            <li
              className={`cursor-pointer text-xs md:text-sm xl:text-base ${filter === 'Complete' ? 'font-bold text-blue-700' : ''}`}
              onClick={() => setFilter('Complete')}
            >
              Completed
            </li>
          </ul>
          <p
            className="cursor-pointer text-xs xl:text-base text-red-500"
            onClick={clearAll}
          >
            Clear
          </p>
        </div>

        <div className='flex flex-col gap-1 w-full'>
          {filteredTodos.map(todo => (
            <div
              key={todo.id}
              className="bg-white w-80 lg:w-1/4 rounded-md flex justify-between items-center border-b p-3 mx-auto"
            >
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  className="mr-2"
                />
                <p className={`text-sm ${todo.completed ? 'line-through text-gray-500' : ''}`}>
                  {todo.text}
                </p>
              </div>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="text-red-500 text-sm"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
        
      </div>
    </div>
  );
};

export default Index;