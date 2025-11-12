const EmployeeTable = ({ data }) => {

  // Jika data belum ada, tampilkan loading atau kosong
  if (!data || data.length === 0) {
    return <p className="text-center text-gray-500 mt-10">Loading data...</p>;
  }
  console.log("Rendering EmployeeTable with data:", data);

  return (
    <div className="mt-12">
      <div className="grid gap-4 max-w-3xl mx-auto">
        
        {data.map((emp, index) => (
          <div
            key={emp.id_employe || index}
            className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-base text-gray-900">
                {emp.name}
              </h3>
              <span className="text-[10px] px-2 py-1 rounded-full bg-[#f9140D]/15 text-[#f9140D] font-medium">
                {emp.position}
              </span>
            </div>

            <p className="text-xs text-gray-500 mt-2">
              Joined: {emp.date_of_birth}
            </p>

            <button className="mt-3 text-sm text-[#f9140D] hover:text-[#c00] transition">
              View Details
            </button>
          </div>
        ))}

      </div>
    </div>
  );
};

export default EmployeeTable;
