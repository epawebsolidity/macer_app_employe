"use client";

import { NavItem } from "@/types/NavItem";
import { useState } from "react";
import Navbar from "./Navbar";

export default function NavbarClient({ navItems }: { navItems: NavItem[] }) {
  const [isOpen, setIsOpen] = useState(false);
  return <Navbar isOpen={isOpen} setIsOpen={setIsOpen} navItems={navItems} />;
}
