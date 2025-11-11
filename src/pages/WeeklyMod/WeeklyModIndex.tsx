import { useMemo, useState } from "react";
import { useWeeklyModData } from "../../hooks/useWeeklyMod";
import { LoadingState } from "../../components/LoadingState/LoadingState";
import { ErrorState } from "../../components/ErrorState/ErrorState";
import { Filters } from "../../components/Filters/Filters";
import { DataTable } from "../../components/DataTable/DataTable";
import { SummaryCards } from "../../components/SummaryCards/SummaryCards";

export const WeeklyModIndex = () => {
    const { data, loading, error, refetch } = useWeeklyModData();
    const [selectedWeek, setSelectedWeek] = useState<number | 'all'>('all');
    const [searchTerm, setSearchTerm] = useState('');

    const uniqueWeeks = useMemo(() =>
        Array.from(new Set(data.map(item => item.weekNumber))).sort(),
        [data]
    );

    const filteredData = useMemo(() =>
        data.filter(item => {
            const matchesWeek = selectedWeek === 'all' || item.weekNumber === selectedWeek;
            const matchesSearch = item.materialType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.weekNumber.toString().includes(searchTerm);
            return matchesWeek && matchesSearch;
        }),
        [data, selectedWeek, searchTerm]
    );

    const totals = useMemo(() =>
        filteredData.reduce((acc, item) => ({
            productionVolume: acc.productionVolume + item.productionVolume,
            hoursNeed: acc.hoursNeed + item.hoursNeed,
            mod: acc.mod + item.mod,
            hoursPersonAvailable: acc.hoursPersonAvailable + item.hoursPersonAvailable,
            excessPersonHours: acc.excessPersonHours + item.excessPersonHours,
        }), {
            productionVolume: 0,
            hoursNeed: 0,
            mod: 0,
            hoursPersonAvailable: 0,
            excessPersonHours: 0,
        }),
        [filteredData]
    );

    if (loading) {
        return <LoadingState />;
    }

    if (error) {
        return <ErrorState error={error} onRetry={refetch} />;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Reporte Semanal de MOD
                    </h1>
                    <p className="text-gray-600">
                        Análisis de productividad y eficiencia
                    </p>
                </div>

                <Filters
                    selectedWeek={selectedWeek}
                    searchTerm={searchTerm}
                    uniqueWeeks={uniqueWeeks}
                    onWeekChange={setSelectedWeek}
                    onSearchChange={setSearchTerm}
                    totalRecords={data.length}
                    filteredRecords={filteredData.length}
                />

                <DataTable data={filteredData} totals={totals} />

                {filteredData.length > 0 && (
                    <SummaryCards totals={totals} />
                )}
            </div>
        </div>
    );
};