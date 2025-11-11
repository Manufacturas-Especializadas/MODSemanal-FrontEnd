import { useState, useEffect } from 'react';
import type { WeeklyModData } from '../types/WeeklyModData';

export const useWeeklyModData = () => {
    const [data, setData] = useState<WeeklyModData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            // Simulamos una llamada a API - reemplaza con tu endpoint real
            // const response = await fetch('/api/weekly-mod');
            // const result: WeeklyModData[] = await response.json();            

            const sampleData: WeeklyModData[] = [
                {
                    "id": 5,
                    "weekNumber": 46,
                    "materialType": "CU",
                    "productivityTarget": 5.2,
                    "productionVolume": 40000,
                    "hoursNeed": 7692,
                    "mod": 311,
                    "hoursPersonAvailable": 14461,
                    "excessPersonHours": 6769,
                    "excessHoursPerPerson": 21.77
                },
                {
                    "id": 6,
                    "weekNumber": 46,
                    "materialType": "AL",
                    "productivityTarget": 5.2,
                    "productionVolume": 7000,
                    "hoursNeed": 1346,
                    "mod": 70,
                    "hoursPersonAvailable": 3255,
                    "excessPersonHours": 1909,
                    "excessHoursPerPerson": 27.27
                },
                {
                    "id": 7,
                    "weekNumber": 47,
                    "materialType": "CU",
                    "productivityTarget": 5.5,
                    "productionVolume": 45000,
                    "hoursNeed": 8182,
                    "mod": 330,
                    "hoursPersonAvailable": 15000,
                    "excessPersonHours": 6818,
                    "excessHoursPerPerson": 20.66
                }
            ];

            setData(sampleData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cargar los datos');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return {
        data,
        loading,
        error,
        refetch: fetchData
    };
};