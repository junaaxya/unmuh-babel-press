"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getSettings, updateSettings } from "@/app/services/api";
import FaviconUploader from "./FaviconUploader";

const settingGroups = {
  general: {
    label: "General",
    fields: ["siteName", "faviconUrl"],
  },
  security: {
    label: "Security",
    fields: ["require2FA", "sessionMaxAgeHours"],
  },
};

export default function SettingsPage() {
  const { data: session } = useSession();
  const role = session?.user?.role ?? "VIEWER";
  const canEdit = role === "ADMIN" || role === "EDITOR";

  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const data = await getSettings();
      const { id, createdAt, updatedAt, ...editable } = data || {};
      setSettings(editable);
      setLoading(false);
    })();
  }, []);


  const handleChange = (key, value) => {
    let parsed = value;
    if (key === "sessionMaxAgeHours") {
      parsed = Number(value);
    }
    setSettings((prev) => ({ ...prev, [key]: parsed }));
  };

  const handleSave = async () => {
    if (!canEdit) return;
    setSaving(true);
    await updateSettings(settings);
    setSaving(false);
  };


  if (loading) return <div>Loading settings…</div>;
  if (!settings) return <div>No settings found.</div>;

  const fields = settingGroups[activeTab].fields;

  return (
    <main className="p-4 space-y-4">
      <header className="flex items-center justify-between">
        <h1>
          Settings {!canEdit && <span className="ml-2 text-sm">(Read-only)</span>}
        </h1>
        {canEdit && (
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white"
          >
            {saving ? "Saving…" : "Save Settings"}
          </button>
        )}
      </header>

      <nav className="flex space-x-2 border-b">
        {Object.entries(settingGroups).map(([key, g]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-3 py-2 ${
              activeTab === key ? "border-b-2 border-blue-600" : ""
            }`}
          >
            {g.label}
          </button>
        ))}
      </nav>

      <section className="space-y-4">
        {fields.map((f) => {
          const isBoolean = f === "require2FA";
          const isNumber = f === "sessionMaxAgeHours";
          const isFavicon = f === "faviconUrl";
          return (
            <div key={f} className="flex flex-col">
              <label className="text-sm mb-1">{f}</label>
              {isFavicon ? (
                <FaviconUploader
                  value={settings[f]}
                  onChange={(url) => handleChange(f, url)}
                  disabled={!canEdit}
                />
              ) : isBoolean ? (
                <input
                  type="checkbox"
                  checked={settings[f] ?? false}
                  onChange={(e) => handleChange(f, e.target.checked)}
                  disabled={!canEdit}
                />
              ) : (
                <input
                  type={isNumber ? "number" : "text"}
                  value={settings[f] ?? ""}
                  onChange={(e) => handleChange(f, e.target.value)}
                  readOnly={!canEdit}
                  className="border p-2"
                />
              )}
            </div>
          );
        })}
      </section>
    </main>

  );
}

