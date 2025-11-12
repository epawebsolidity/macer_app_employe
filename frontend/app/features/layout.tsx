import Footer from "@/components/Footer/Footer";
import NavbarClient from "@/components/Navbar/NavbarClient"; // ubah ini

export const metadata = {
  title: "Home",
};

const NavItems = [
  { to: "/features/admin/home", label: "Home" },
  { to: "/features/admin/employe", label: "Employee" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  
  return (
    <div className="flex flex-col min-h-screen">
     <NavbarClient navItems={NavItems} />       
      <main className="flex-1 overflow-y-auto">{children}</main>
      <Footer />
    </div>
  );
}
