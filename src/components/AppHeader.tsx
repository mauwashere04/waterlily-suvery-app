import { LogoutButton } from "./LogoutButton";

export function AppHeader({ email }: { email: string }) {
  return (
    <header className="flex items-center justify-between border-b border-zinc-200 px-6 py-4 dark:border-zinc-800">
      <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
        Waterlily Intake
      </span>
      <div className="flex items-center gap-4">
        <span className="hidden text-sm text-zinc-500 sm:inline dark:text-zinc-400">
          {email}
        </span>
        <LogoutButton />
      </div>
    </header>
  );
}
