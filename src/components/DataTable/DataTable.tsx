import React, { useMemo } from 'react';
import type { WeeklyModData } from '../../types/WeeklyModData';

interface DataTableProps {
    data: WeeklyModData[];
    totals: {
        productionVolume: number;
        hoursNeed: number;
        mod: number;
        hoursPersonAvailable: number;
        excessPersonHours: number;
    };
    onEdit: (weekNumber: number, weekData: WeeklyModData[]) => void;
}

export const DataTable: React.FC<DataTableProps> = ({ data, totals, onEdit }) => {
    const dataByWeek = useMemo(() => {
        const grouped: { [weekNumber: number]: WeeklyModData[] } = {};
        data.forEach(item => {
            if (!grouped[item.weekNumber]) {
                grouped[item.weekNumber] = [];
            }
            grouped[item.weekNumber].push(item);
        });
        return grouped;
    }, [data]);

    if (data.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                <div className="text-gray-400 mb-4">
                    <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                    No se encontraron registros
                </h3>
                <p className="text-gray-500">
                    Intenta ajustar los filtros de búsqueda
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Semana
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Material
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Productividad
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Volumen
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Horas Requeridas
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                MOD
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Horas Disponibles
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Exceso Horas
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Exceso por Persona
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Acciones
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {data.map((item) => (
                            <tr
                                key={item.id}
                                className="hover:bg-gray-50 transition-colors duration-150"
                            >
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        Semana {item.weekNumber}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        {item.materialType}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {item.productivityTarget.toFixed(1)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {item.productionVolume.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {item.hoursNeed.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {item.mod.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {item.hoursPersonAvailable.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {item.excessPersonHours.toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.excessHoursPerPerson > 20
                                        ? 'bg-red-100 text-red-800'
                                        : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {item.excessHoursPerPerson.toFixed(2)}h
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    {dataByWeek[item.weekNumber]?.[0]?.id === item.id && (
                                        <button
                                            onClick={() => onEdit(item.weekNumber, dataByWeek[item.weekNumber])}
                                            className="text-blue-600 hover:text-blue-900 transition-colors hover:cursor-pointer"
                                            title="Editar semana"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>

                    {/* Totales */}
                    <tfoot className="bg-gray-50 border-t-2 border-gray-200">
                        <tr>
                            <td colSpan={3} className="px-6 py-4 text-sm font-medium text-gray-900">
                                Totales
                            </td>
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                {totals.productionVolume.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                {totals.hoursNeed.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                {totals.mod.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                {totals.hoursPersonAvailable.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                {totals.excessPersonHours.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                -
                            </td>
                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                -
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
};