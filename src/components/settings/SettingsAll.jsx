import React from "react";
import ThemeToggle from "../ThemeToggle";
import ChangePassword from "./ChangePassword";
import NotificationSettings from "./NotificationSettings";
import LanguageSettings from "./LanguageSettings";
import PrivacySettings from "./PrivacySettings";

const SettingsAll = () => {
  return (
    <div className="p-6 dark:bg-gray-900 dark:text-white min-h-screen">
      <h2 className="text-2xl font-bold mb-6">⚙️ Settings</h2>

      <div className="space-y-6">
        <section>
          <h3 className="text-xl font-semibold mb-2">🌗 Theme</h3>
          <ThemeToggle />
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-2">🔐 Change Password</h3>
          <ChangePassword />
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-2">🔔 Notifications</h3>
          <NotificationSettings />
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-2">🌐 Language</h3>
          <LanguageSettings />
        </section>

        <section>
          <h3 className="text-xl font-semibold mb-2">🛡️ Privacy</h3>
          <PrivacySettings />
        </section>
      </div>
    </div>
  );
};

export default SettingsAll;
