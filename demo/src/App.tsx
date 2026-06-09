import { useState } from "react";
import {
  Button,
  Chip,
  ConfirmDialog,
  Toggle,
} from "@kaufman2699/kr-design-system";

export function App() {
  const [showDialog, setShowDialog] = useState(false);
  const [webSearch, setWebSearch] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4">
      <path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-[#F9FAFB] p-8 font-sans">
      <div className="mx-auto max-w-2xl space-y-10">

        <header>
          <h1 className="text-3xl font-bold text-[#1E4C7E]">
            KR Design System Demo
          </h1>
          <p className="mt-2 text-gray-600">
            Example app consuming <code className="rounded bg-gray-100 px-1.5 py-0.5 text-sm">@kaufman2699/kr-design-system</code>
          </p>
        </header>

        {/* Buttons */}
        <section>
          <h2 className="mb-4 text-xl font-semibold text-gray-800">Buttons</h2>
          <div className="flex flex-wrap gap-3">
            <Button variant="default">Primary</Button>
            <Button variant="accent">Accent</Button>
            <Button variant="destructive" onClick={() => setShowDialog(true)}>
              Delete
            </Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="default" disabled>Disabled</Button>
          </div>
        </section>

        {/* Chips */}
        <section>
          <h2 className="mb-4 text-xl font-semibold text-gray-800">Chips</h2>
          <div className="flex flex-wrap gap-2">
            <Chip
              icon={<SearchIcon />}
              selected={webSearch}
              onClick={() => setWebSearch(!webSearch)}
            >
              {webSearch ? "Web Search Enabled" : "Enable Web Search"}
            </Chip>
            <Chip>Code Mode</Chip>
            <Chip disabled>Premium Feature</Chip>
          </div>
        </section>

        {/* Toggle */}
        <section>
          <h2 className="mb-4 text-xl font-semibold text-gray-800">Toggle</h2>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <Toggle
                checked={notifications}
                onChange={setNotifications}
              />
              Notifications {notifications ? "on" : "off"}
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <Toggle defaultChecked={false} />
              Dark mode
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-400">
              <Toggle disabled />
              Unavailable
            </label>
          </div>
        </section>

        {/* Confirm Dialog */}
        <section>
          <h2 className="mb-4 text-xl font-semibold text-gray-800">Confirm Dialog</h2>
          <p className="mb-3 text-sm text-gray-600">
            Click the "Delete" button above to trigger the dialog:
          </p>
          {showDialog && (
            <ConfirmDialog
              title="Delete item?"
              description={<>This will permanently delete <strong>Project Alpha</strong>. This action cannot be undone.</>}
              confirmLabel="Delete"
              cancelLabel="Cancel"
              variant="destructive"
              onConfirm={() => {
                alert("Deleted!");
                setShowDialog(false);
              }}
              onCancel={() => setShowDialog(false)}
            />
          )}
        </section>

      </div>
    </div>
  );
}
