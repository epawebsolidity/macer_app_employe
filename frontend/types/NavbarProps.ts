interface NavItem {
  to: string;
  label: string;
}

export interface NavbarProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  navItems: NavItem[];
}