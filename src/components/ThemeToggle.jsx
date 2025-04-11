import React, { useEffect, useState } from "react";

const ThemeToggle = () => {
  const [theme, setTheme] = useState(() =>
    localStorage.getItem("theme") || "dark"
  );

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div className="flex items-center justify-between gap-3 p-2">
      <span className="text-sm font-medium">Theme:</span>
      <button
        onClick={toggleTheme}
        className={`px-4 py-2 text-sm font-semibold rounded-lg ${
          theme === "dark"
            ? "bg-gray-800 text-white hover:bg-gray-700"
            : "bg-yellow-300 text-black hover:bg-yellow-400"
        }`}
      >
        {theme === "dark" ? "🌙 Dark" : "☀️ Light"}
      </button>
    </div>
  );
};

export default ThemeToggle;
