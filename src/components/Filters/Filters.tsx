import type React from "react";

interface FilterProps {
    selectedWeek: number | "all";
    searchTerm: string;
    uniqueWeeks: number[];
    onWeekChange: (week: number | "all") => void;
    onSearchChange: (term: string) => void;
    totalRecords: number;
    filteredRecords: number;
};

export const Filters: React.FC<FilterProps> = ({
    selectedWeek,
    searchTerm,
    uniqueWeeks,
    onWeekChange,
    onSearchChange,
    totalRecords,
    filteredRecords
}) => {
    return (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Filtrar por semana
                    </label>
                    <select
                        value={selectedWeek}
                        onChange={(e) => onWeekChange(e.target.value === "all" ? "all" : Number(e.target.value))}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2
                        focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="all">
                            Todas las semanas
                        </option>
                        {
                            uniqueWeeks.map(week => (
                                <option key={week} value={week}>
                                    Semana {week}
                                </option>
                            ))
                        }
                    </select>
                </div>
            </div>
        </div>
    );
};