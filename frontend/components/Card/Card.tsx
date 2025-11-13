import type { CardEmployeProps } from "@/types/CardEmployeProps";

const CardEmploye = ({ employee, onSendReward }: CardEmployeProps) => {
  return (
    <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-base text-gray-900">{employee.name}</h3>
        <span className="text-[10px] px-2 py-1 rounded-full bg-[#f9140D]/15 text-[#f9140D] font-medium">
          Position : {employee.position}
        </span>
      </div>

      <p className="text-xs text-gray-500 mt-2">Joined: {employee.date_of_birth}</p>

      <button
        onClick={() => onSendReward && onSendReward(employee.id_employe)}
        className="mt-3 bg-blue-700 px-2 py-1 text-xs text-white rounded-full hover:text-gray-200 font-bold transition"
      >
        Send Allocation Rewards
      </button>
    </div>
  );
};

export default CardEmploye;
