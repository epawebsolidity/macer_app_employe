"use client";

import { EmployeUsers } from "@/app/hooks/useEmploye";
import EmployeTable from "@/components/Table/TableEmploye";
import { useEffect, useState } from "react";

const EmployePage = () => {
   const [employees, setEmployees] = useState([]);
useEffect(() => {
    const fetchData = async () => {
      const res = await EmployeUsers();
      console.log("Employee Data:", res.data);
      setEmployees(res?.data); // Sesuaikan sesuai response backend
    };
    fetchData();
  }, []);

  
 
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
      <EmployeTable data={employees}  />
    </div>
  );
};

export default EmployePage;
