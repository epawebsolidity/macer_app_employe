"use client";

import { EmployeUsers } from "@/app/hooks/useEmploye";
import Card from "@/components/Card/Card";
import type { Employee } from "@/types/Employe";
import { useEffect, useState } from "react";

const EmployePage = () => {

  const [employees, setEmployees] = useState<Employee[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      const res = await EmployeUsers();
      console.log("Employee Data:", res.data);
      setEmployees(res?.data); // Sesuaikan sesuai response backend
    };
    fetchData();
  }, []);

  if (!employees || employees.length === 0) {
    return (
      <p className="text-center text-gray-500 mt-10">Loading data...</p>
    );
  }

  return (
    <div className="min-h-screen font-sans text-black px-6 md:px-16 py-24">
      <div className="max-w-3xl mx-auto text-center">

        {/* Title Section */}
        <h1 className="text-2xl sm:text-3xl font-bold tracking-wide">
          Mancer All Data Employe
        </h1>

        <p className="text-black/70 text-sm sm:text-base leading-relaxed mt-2 mx-auto">
          Welcome to the Employee Management System. Here you can find all the data related to employees, including their profiles, roles, and activities within the organization.
        </p>
      </div>

      <div className="mt-12 grid gap-4 max-w-3xl mx-auto">
        {employees.map((emp, index) => (
          <Card key={emp.id_employe || index} employee={emp} />
        ))}
      </div>
    </div>
  );
};

export default EmployePage;
