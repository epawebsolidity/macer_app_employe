import type { Employee } from "@/types/Employe";

const CardEmploye = ({ employee }: { employee: Employee }) => {
  return (
    <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-base text-gray-900">{employee.name}</h3>
        <span className="text-[10px] px-2 py-1 rounded-full bg-[#f9140D]/15 text-[#f9140D] font-medium">
          {employee.position}
        </span>
      </div>
      <p className="text-xs text-gray-500 mt-2">Joined: {employee.date_of_birth}</p>
      <button className="mt-3 text-sm text-[#f9140D] hover:text-[#c00] transition">
        View Details
      </button>
    </div>
  );
};

export default CardEmploye;
