// Root admin layout - no auth check here
// Auth is handled in (dashboard)/layout.tsx for protected routes
// Login page in (auth) route group is not protected
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Just pass through - let child layouts handle auth
  return <>{children}</>;
}
