import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./App.css";

export default function SpaceTodoApp() {
  const MAX_TASKS = 50;
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("spaceTasks");
    return saved ? JSON.parse(saved) : [];
  });
  const [input, setInput] = useState("");
  const [editingId, setEditingId] = useState(null); // 🔹 Editing state

  const completedCount = tasks.filter((t) => t.done).length;
  const percent = Math.round((completedCount / MAX_TASKS) * 100);

  useEffect(() => {
    localStorage.setItem("spaceTasks", JSON.stringify(tasks));
  }, [tasks]);

  function addTask(e) {
    e.preventDefault();
    if (!input.trim()) return;

    if (editingId) {
      // 🔹 Update existing task
      setTasks(
        tasks.map((t) =>
          t.id === editingId ? { ...t, text: input } : t
        )
      );
      setEditingId(null);
    } else {
      // 🔹 Add new task
      setTasks([{ id: Date.now(), text: input, done: false }, ...tasks]);
    }
    setInput("");
  }

  function toggleTask(id) {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  function removeTask(id) {
    setTasks(tasks.filter((t) => t.id !== id));
  }

  function startEdit(task) {
    setInput(task.text);
    setEditingId(task.id);
  }

  return (
    <div className="app">
      <h1>🚀 Space To-Do Mission</h1>
      <div className="space-scene">
        {/* Stars */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="star"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          ></div>
        ))}

        {/* Rocket */}
        <motion.div
          className="rocket"
          initial={{ y: 200 }}
          animate={{ y: -percent * 2 }}
          transition={{ type: "spring", stiffness: 50 }}
        >
          🚀
        </motion.div>

        {/* Planets */}
        {percent > 30 && <div className="planet planet1">🪐</div>}
        {percent > 60 && <div className="planet planet2">🌍</div>}
        {percent === 100 && <div className="galaxy">🌌✨</div>}
      </div>

      {/* Task Form */}
      <form onSubmit={addTask} className="task-form">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add or edit a mission task..."
        />
        <button type="submit">{editingId ? "Update" : "Add"}</button>
      </form>

      {/* Task List */}
      <ul className="tasks">
        {tasks.map((t) => (
          <li key={t.id} className={t.done ? "done" : ""}>
            <label>
              <input
                type="checkbox"
                checked={t.done}
                onChange={() => toggleTask(t.id)}
              />
              {t.text}
            </label>
            <div>
              <button onClick={() => startEdit(t)}>✏️</button>
              <button onClick={() => removeTask(t.id)}>❌</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
