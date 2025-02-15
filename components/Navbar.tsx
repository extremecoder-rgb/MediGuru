"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="p-4 bg-gray-900 text-white flex justify-between">
      <h1 className="text-xl font-bold">MediGuru</h1>
      {session ? (
        <div>
          <span>Welcome, {session.user?.name}</span>
          <button onClick={() => signOut()} className="ml-4 bg-red-500 p-2 rounded">
            Sign Out
          </button>
        </div>
      ) : (
        <button onClick={() => signIn()} className="bg-blue-500 p-2 rounded">
          Sign In
        </button>
      )}
    </nav>
  );
}