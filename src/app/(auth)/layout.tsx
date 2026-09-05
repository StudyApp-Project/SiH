export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 bg-white text-slate-900 text-gray-900 flex flex-col antialiased">
      {children}
    </div>
  );
}
