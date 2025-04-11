import React from "react";
import ThemeToggle from "../components/ThemeToggle";

const SettingsAll = () => {
  return (
    <div className="p-6 dark:bg-gray-900 dark:text-white min-h-screen">
      <h2 className="text-2xl font-bold mb-4">⚙️ Settings</h2>
      <ThemeToggle />
    </div>
  );
};

export default SettingsAll;
