# 🧨 Minesweeper (React + Tailwind)

A modern, responsive **Minesweeper** game built with **React** and **Tailwind CSS**, designed to work seamlessly on both desktop and mobile devices.

## 🌐 **Live Demo:** [Link](https://minesweeper-five-chi.vercel.app)

## 🎮 Features

- 🧩 Classic Minesweeper gameplay with 4 difficulty modes:
  - **Easy** – Small grid, few mines.
  - **Normal** – Standard experience.
  - **Hard** – Larger board, more mines.
  - **Asian** – Ultimate challenge 😈 (biggest board, most mines).
- 📱 **Mobile-friendly design** (tap to reveal, long-press or toggle to flag).
- 💣 Displays remaining unflagged mines.
- 🔄 Restart anytime without reloading.
- 🎨 Clean Tailwind CSS interface.
- ⚡ Split modular structure for easy extension.

---

## 🛠️ Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/minesweeper.git
cd minesweeper
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Run the Game

```bash
npm start
```

Then open your browser to **http://localhost:3000**.

---

## 🧱 Project Structure

```
src/
├── App.jsx             # Root component
├── Minesweeper.jsx     # Main game logic
├── GameControls.jsx    # UI for status, difficulty, restart
├── gameUtils.js        # Game board generation and logic
├── index.css           # Tailwind setup
└── index.js            # React entry point
```

---

## 🎨 Technologies

- **React (Vite or CRA)**
- **Tailwind CSS**
- **JavaScript (ES6+)**

---

## 🚀 Future Improvements

- ⏱️ Timer and best time tracker.
- 💾 Persistent local high score.
- 🏆 Win animation and celebration.
- 🌙 Dark mode toggle.

---

## 📜 License

This project is released under the **MIT License**.

---

Made with ❤️ by [Your Name]
