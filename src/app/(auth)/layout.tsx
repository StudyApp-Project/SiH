export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 to-indigo-100 dark:from-zinc-900 dark:to-blue-900">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
