// Gunakan async/await untuk cookies()
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function AdminLayout({ children }) {
  return <div className="bg-gray-100 dark:bg-gray-900">{children}</div>;
}
