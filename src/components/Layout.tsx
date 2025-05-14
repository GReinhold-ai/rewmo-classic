import Navbar from './Navbar'
import BottomTabBar from './BottomTabBar'
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <Navbar />
      <main className="flex-1 p-4">{children}</main>
      <BottomTabBar />
    </div>
  )
}
