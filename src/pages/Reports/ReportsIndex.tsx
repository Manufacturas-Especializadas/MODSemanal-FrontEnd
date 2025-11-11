import { useEffect, useState } from "react";
import type { WeeklyModData } from "../../types/WeeklyModData";
import { weeklyService } from "../../api/services/WeeklyModService";
import { DownloadReportButton } from "../../components/DownloadReportButton/DownloadReportButton";
import { Link } from "react-router-dom";
import { BsArrowLeft } from "react-icons/bs";

export const ReportsIndex = () => {
    const [weeklyData, setWeeklyData] = useState<WeeklyModData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const uniqueWeeks = Array.from(new Set(weeklyData.map(item => item.weekNumber)))
        .sort((a, b) => b - a);

    const dataByWeek = uniqueWeeks.map(week => ({
        weekNumber: week,
        data: weeklyData.filter(item => item.weekNumber === week)
    }));

    const loadWeeklyData = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await weeklyService.getAll();
            setWeeklyData(data);
        } catch (err: any) {
            setError(err instanceof Error ? err.message : "Error al cargar los datos");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadWeeklyData();
    }, []);

    const getMaterialData = (weekData: WeeklyModData[], materialType: "CU" | "AL") => {
        return weekData.find(item => item.materialType === materialType);
    };

    const calculateTotalExcessHours = (weekData: WeeklyModData[]) => {
        return weekData.reduce((total, item) => total + (item.excessPersonHours || 0), 0);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Cargando reportes...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
                        <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <h3 className="text-lg font-semibold text-red-800 mb-2">Error</h3>
                        <p className="text-red-600 mb-4">{error}</p>
                        <button
                            onClick={loadWeeklyData}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            Reintentar
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Link to="/">
                    <BsArrowLeft size="35" className="bg-white rounded-full mb-5" />
                </Link>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="bg-blue-100 p-3 rounded-lg">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Semanas Registradas</p>
                                <p className="text-2xl font-bold text-gray-900">{uniqueWeeks.length}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="bg-green-100 p-3 rounded-lg">
                                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Última Semana</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {uniqueWeeks.length > 0 ? `Semana ${uniqueWeeks[0]}` : 'N/A'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="bg-orange-100 p-3 rounded-lg">
                                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Horas Cobre</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {weeklyData
                                        .filter(item => item.materialType === "CU")
                                        .reduce((sum, item) => sum + (item.hoursPersonAvailable || 0), 0)
                                        .toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center">
                            <div className="bg-purple-100 p-3 rounded-lg">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div className="ml-4">
                                <p className="text-sm font-medium text-gray-600">Total Horas Aluminio</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {weeklyData
                                        .filter(item => item.materialType === "AL")
                                        .reduce((sum, item) => sum + (item.hoursPersonAvailable || 0), 0)
                                        .toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Weeks Grid */}
                {dataByWeek.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                        <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay reportes registrados</h3>
                        <p className="text-gray-600 mb-6">No se encontraron reportes semanales en el sistema.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {dataByWeek.map(({ weekNumber, data }) => {
                            const cuData = getMaterialData(data, "CU");
                            const alData = getMaterialData(data, "AL");
                            const totalExcessHours = calculateTotalExcessHours(data);

                            return (
                                <div
                                    key={weekNumber}
                                    className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
                                >
                                    {/* Card Header */}
                                    <div className="border-b border-gray-200 px-6 py-4">
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                Semana {weekNumber}
                                            </h3>
                                            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                                {data.length} materiales
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <div className="space-y-4 mb-6">
                                            {cuData && (
                                                <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                                                    <div className="flex items-center">
                                                        <div className="w-3 h-3 bg-orange-500 rounded-full mr-3"></div>
                                                        <span className="font-medium text-gray-700">Cobre</span>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm text-gray-600">Exceso: {cuData.excessPersonHours?.toLocaleString()} hrs</p>
                                                        <p className="text-xs text-gray-500">{cuData.excessHoursPerPerson?.toFixed(2)} hrs/persona</p>
                                                    </div>
                                                </div>
                                            )}

                                            {alData && (
                                                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                                                    <div className="flex items-center">
                                                        <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                                                        <span className="font-medium text-gray-700">Aluminio</span>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm text-gray-600">Exceso: {alData.excessPersonHours?.toLocaleString()} hrs</p>
                                                        <p className="text-xs text-gray-500">{alData.excessHoursPerPerson?.toFixed(2)} hrs/persona</p>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                            <div className="flex justify-between items-center">
                                                <span className="font-semibold text-gray-700">Total Exceso:</span>
                                                <span className="text-lg font-bold text-green-600">
                                                    {totalExcessHours.toLocaleString()} hrs
                                                </span>
                                            </div>
                                        </div>

                                        <DownloadReportButton
                                            weekNumber={weekNumber}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </main>
        </div>
    );
};