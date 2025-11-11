import { useState, useEffect } from 'react';
import type { WeeklyModData } from '../types/WeeklyModData';
import { weeklyService } from '../api/services/WeeklyModService';

export const useWeeklyModData = () => {
    const [data, setData] = useState<WeeklyModData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await weeklyService.getAll()

            setData(response);
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