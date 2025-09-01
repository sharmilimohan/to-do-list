import React, { useState, useEffect } from "react";
import "./App.css";

export default function TodoApp() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks"));
    if (storedTasks) setTasks(storedTasks);
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (input.trim() === "") return;

    if (editingId !== null) {
      const updatedTasks = tasks.map(task =>
        task.id === editingId ? { ...task, text: input } : task
      );
      setTasks(updatedTasks);
      setEditingId(null);
    } else {
      setTasks([...tasks, { id: Date.now(), text: input, completed: false }]);
    }
    setInput("");
  };

  const toggleTask = (id) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  const editTask = (id) => {
    const taskToEdit = tasks.find(task => task.id === id);
    setInput(taskToEdit.text);
    setEditingId(id);
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "pending") return !task.completed;
    return true;
  });

  return (
    <div className="to-do-app">
      <h1 className="insert-mp">To-do-List</h1>

      <div className="source-s">
        <input
          type="text"
          className="border-to"
          placeholder="Enter task..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={addTask} className="border-done">
          {editingId !== null ? "Update" : "Add"}
        </button>
      </div>

      <div className="counter">
        <button onClick={() => setFilter("all")} className="rounded-1">All</button>
        <button onClick={() => setFilter("completed")} className="rounded-2">Completed</button>
        <button onClick={() => setFilter("pending")} className="rounded-3">Pending</button>
      </div>

      <ul className="lungss">
        {filteredTasks.map((task) => (
          <li key={task.id} className="indexcore">
            <div className="systemadd">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
              />
              <span className={`${task.completed ? "line-through text-gray-500" : ""}`}>
                {task.text}
              </span>
            </div>
            <div className="var1">
              <button onClick={() => editTask(task.id)} className="variable2">✏️</button>
              <button onClick={() => deleteTask(task.id)} className="textcore1">🗑️</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
