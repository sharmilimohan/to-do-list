import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "./App.css";

export default function SpaceTodoApp() {
  const PLANET_INTERVAL = 2;

  const [maxTasks, setMaxTasks] = useState(() => {
    const saved = localStorage.getItem("spaceMaxTasks");
    return saved ? JSON.parse(saved) : null;
  });

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("spaceTasks");
    return saved ? JSON.parse(saved) : [];
  });

  const [input, setInput] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [showCongrats, setShowCongrats] = useState(false);
  const [taskLimitInput, setTaskLimitInput] = useState("");
  const [bubbles, setBubbles] = useState([]); 

  const completedCount = tasks.filter((t) => t.done).length;
  const percent = maxTasks ? Math.round((completedCount / maxTasks) * 100) : 0;
  const planetCount = Math.floor(completedCount / PLANET_INTERVAL);

  useEffect(() => {
    localStorage.setItem("spaceTasks", JSON.stringify(tasks));
    if (maxTasks) {
      localStorage.setItem("spaceMaxTasks", JSON.stringify(maxTasks));
    }

    if (maxTasks && completedCount === maxTasks) {
      setShowCongrats(true);
    } else {
      setShowCongrats(false);
    }
  }, [tasks, completedCount, maxTasks]);

  function setMission(e) {
    e.preventDefault();
    const num = parseInt(taskLimitInput);
    if (!num || num <= 0) {
      alert("⚠️ Please enter a valid number greater than 0.");
      return;
    }
    setMaxTasks(num);
    setTaskLimitInput("");
  }

  function addTask(e) {
    e.preventDefault();
    if (!input.trim()) return;
    if (!editingId && tasks.length >= maxTasks) {
      alert(`🚫 Mission limit reached! You can only add ${maxTasks} tasks.`);
      return;
    }
    if (editingId) {
      setTasks(tasks.map((t) => (t.id === editingId ? { ...t, text: input } : t)));
      setEditingId(null);
    } else {
      setTasks([{ id: Date.now(), text: input, done: false }, ...tasks]);
    }
    setInput("");
  }

  function toggleTask(id) {
    setTasks(
      tasks.map((t) => {
        if (t.id === id) {
          if (!t.done) createBubble();
          return { ...t, done: !t.done };
        }
        return t;
      })
    );
  }

  function createBubble() {
    const newBubble = {
      id: Date.now(),
      left: Math.random() * 80 + 10,
      emoji: ["😍 ", "😉", "😘","😗","😄"][Math.floor(Math.random() * 5)],
    };
    setBubbles((prev) => [...prev, newBubble]);
    setTimeout(() => {
      setBubbles((prev) => prev.filter((b) => b.id !== newBubble.id));
    }, 1500);
  }

  function removeTask(id) {
    setTasks(tasks.filter((t) => t.id !== id));
  }

  function startEdit(task) {
    setInput(task.text);
    setEditingId(task.id);
  }

  function restartGame() {
    setTasks([]);
    setShowCongrats(false);
    setMaxTasks(null);
    localStorage.removeItem("spaceTasks");
    localStorage.removeItem("spaceMaxTasks");
  }

  return (
    <div className="app">
      <h1>🚀 Space To-Do Mission</h1>

      {!maxTasks && (
        <form onSubmit={setMission} className="mission-setup">
          <input
            type="number"
            value={taskLimitInput}
            onChange={(e) => setTaskLimitInput(e.target.value)}
            placeholder="Enter number of tasks..."
          />
          <button type="submit">Start Mission</button>
        </form>
      )}

      {maxTasks && (
        <>
          {showCongrats && (
            <motion.div
              className="congrats"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 100 }}
            >
              🎉 Congratulations! All {maxTasks} Tasks Completed! 🚀
              <button onClick={restartGame} className="restart-btn">
                🔄 Restart Mission
              </button>
            </motion.div>
          )}

          <div className="progress-container">
            <svg className="progress-ring" width="120" height="120">
              <circle
                className="progress-ring__circle"
                stroke="url(#gradient)"
                strokeWidth="8"
                fill="transparent"
                r="52"
                cx="60"
                cy="60"
                style={{
                  strokeDasharray: `${2 * Math.PI * 52}`,
                  strokeDashoffset: `${2 * Math.PI * 52 - (completedCount / maxTasks) * 2 * Math.PI * 52}`,
                }}
              />
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </svg>
            <p>{completedCount}/{maxTasks}</p>
          </div>

          <div className="space-scene">
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

            <motion.div
              className="rocket"
              initial={{ y: 200 }}
              animate={{ y: -percent * 2 }}
              transition={{ type: "spring", stiffness: 50 }}
            >
              🚀
            </motion.div>

            <div className="planets">
              {planetCount >= 1 && <motion.div className="planet planet1">🪐</motion.div>}
              {planetCount >= 2 && <motion.div className="planet planet2">🌍</motion.div>}
              {planetCount >= 3 && <motion.div className="planet planet3">🌕</motion.div>}
              {planetCount >= 4 && <motion.div className="planet planet4">⭐</motion.div>}
              {planetCount >= 5 && <motion.div className="planet planet5">🌑</motion.div>}
              {planetCount >= 6 && <motion.div className="planet planet6">☄️</motion.div>}
            </div>

            {bubbles.map((b) => (
              <div
                key={b.id}
                className="bubble"
                style={{ left: `${b.left}%`, bottom: "20px" }}
              >
                {b.emoji}
              </div>
            ))}
          </div>

          <form onSubmit={addTask} className="task-form">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Add or edit a mission task..."
            />
            <button type="submit">{editingId ? "Update" : "Add"}</button>
          </form>

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
        </>
      )}
    </div>
  );
}
