import React, { useState, useEffect } from 'react';
import { useTask } from '../context/TaskContext';

const TaskManager = () => {
  const [input, setInput] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Low');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [draggedTaskId, setDraggedTaskId] = useState(null);

  const { tasks, dispatch } = useTask();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleAdd = () => {
    if (input.trim()) {
      dispatch({
        type: 'ADD_TASK',
        payload: {
          id: Date.now(),
          text: input,
          dueDate,
          priority,
          completed: false,
        },
      });
      setInput('');
      setDueDate('');
      setPriority('Low');
    }
  };

  const filteredTasks = tasks.filter(task =>
    task.text.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (filterPriority === '' || task.priority === filterPriority)
  );

  const handleDragStart = (id) => {
    setDraggedTaskId(id);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (id) => {
    if (draggedTaskId === null) return;
    const draggedIndex = tasks.findIndex(task => task.id === draggedTaskId);
    const droppedIndex = tasks.findIndex(task => task.id === id);
    if (draggedIndex === -1 || droppedIndex === -1) return;

    const updatedTasks = [...tasks];
    const [removed] = updatedTasks.splice(draggedIndex, 1);
    updatedTasks.splice(droppedIndex, 0, removed);

    dispatch({ type: 'REORDER_TASKS', payload: updatedTasks });
    setDraggedTaskId(null);
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white dark:bg-gray-900 shadow-lg rounded-xl mt-10 border border-pink-100 dark:border-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-500">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-pink-500 dark:text-pink-300">🌸 Task Manager</h1>
      </div>

      <div className="mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tasks..."
          className="border border-pink-300 dark:border-gray-600 p-2 w-full mb-3 rounded bg-pink-50 dark:bg-gray-800 transition-all"
        />
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="border border-pink-300 dark:border-gray-600 p-2 w-full rounded bg-pink-50 dark:bg-gray-800"
        >
          <option value="">All Priorities</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
      </div>

      <input
        className="border border-purple-300 dark:border-gray-600 p-2 w-full mb-3 rounded bg-purple-50 dark:bg-gray-800"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter a task..."
      />
      <input
        type="date"
        className="border border-purple-300 dark:border-gray-600 p-2 w-full mb-3 rounded bg-purple-50 dark:bg-gray-800"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
      />
      <select
        className="border border-purple-300 dark:border-gray-600 p-2 w-full mb-4 rounded bg-purple-50 dark:bg-gray-800"
        value={priority}
        onChange={(e) => setPriority(e.target.value)}
      >
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>

      <button
        onClick={handleAdd}
        className="bg-pink-400 dark:bg-pink-600 text-white px-4 py-2 w-full rounded hover:bg-pink-500 dark:hover:bg-pink-700 transition-all duration-300 shadow-md hover:scale-105"
      >
        ➕ Add Task
      </button>

      <ul className="mt-8 space-y-3">
        {filteredTasks.map(task => (
          <li
            key={task.id}
            draggable
            onDragStart={() => handleDragStart(task.id)}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(task.id)}
            className="p-4 border border-purple-200 dark:border-gray-700 rounded-xl flex justify-between items-start bg-purple-50 dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] cursor-move"
          >
            <div>
              <p className={`font-medium text-lg ${task.completed ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-800 dark:text-gray-100'}`}>
                {task.text}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Due: {task.dueDate || 'None'} | Priority: {task.priority}</p>
            </div>
            <div className="flex flex-col gap-2 ml-4">
              <button
                onClick={() => dispatch({ type: 'TOGGLE_TASK', payload: task.id })}
                className="text-xs bg-green-300 dark:bg-green-600 text-white px-2 py-1 rounded hover:bg-green-400 dark:hover:bg-green-500 transition-all"
              >
                {task.completed ? 'Undo' : 'Complete'}
              </button>
              <button
                onClick={() => dispatch({ type: 'DELETE_TASK', payload: task.id })}
                className="text-xs bg-red-300 dark:bg-red-600 text-white px-2 py-1 rounded hover:bg-red-400 dark:hover:bg-red-500 transition-all"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskManager;
