"use client";

import { useState } from "react";
import Navbar from "./Navbar";

interface NavItem {
  to: string;
  label: string;
}

export default function NavbarClient({ navItems }: { navItems: NavItem[] }) {
  const [isOpen, setIsOpen] = useState(false);
  return <Navbar isOpen={isOpen} setIsOpen={setIsOpen} navItems={navItems} />;
}
