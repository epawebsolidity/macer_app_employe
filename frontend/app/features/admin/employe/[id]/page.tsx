"use client";
import { EmployeUsers } from "@/app/hooks/useEmploye";
import type { Employee } from "@/types/Employe";
import { useEffect, useState } from "react";

const EmployeeDetailPage = ({ params }: Employee) => {
    const { id } = params;
    const [employee, setEmployee] = useState<Employee | null>(null);

    useEffect(() => {
        const fetchEmployee = async () => {
            const res = await EmployeUsers(); // misal fetch semua, bisa buat API detail khusus
            const emp = res.data.find((e: Employee) => e.id_employe === Number(id));
            setEmployee(emp || null);
        };
        fetchEmployee();
    }, [id]);

    if (!employee) return <p>Loading...</p>;

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-6 md:px-16 py-24 font-sans text-gray-800">
            <div className="max-w-2xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
                        Employee Profile
                    </h1>
                    <p className="text-gray-500 mt-2 text-sm md:text-base">
                        Detailed information about the selected employee
                    </p>
                </div>

                {/* Profile Card */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow duration-300">
                    <div className="flex flex-col items-center text-center">
                        {/* Avatar */}
                        <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white text-2xl font-bold shadow-md">
                            {employee.name.charAt(0)}
                        </div>

                        {/* Info */}
                        <h1 className="mt-4 text-2xl font-semibold text-gray-900">
                            {employee.name}
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Position: <span className="font-medium text-gray-700">{employee.position}</span>
                        </p>

                        <div className="mt-6 w-full border-t border-gray-200 pt-4 text-sm">
                            <p className="text-gray-600">
                                <span className="font-medium text-gray-800">Date of Birth:</span>{" "}
                                {employee.date_of_birth}
                            </p>
                        </div>
                        <form className="mt-10 border-t border-gray-200 pt-6 text-center">
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                                <input
                                    type="number"
                                    placeholder="send token phii ...."
                                    className="w-full sm:w-2/3 px-4 text-xs py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-700"
                                />
                                <button
                                    type="submit"
                                    className="bg-red-600 text-xs  hover:bg-red-700 text-white px-6 py-2 rounded-full font-semibold shadow-md transition"
                                >
                                    Send
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeDetailPage;
