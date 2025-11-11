const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!API_BASE_URL) {
    throw new Error("API base URL is not defined in environment variables");
}

export const API_CONFIG = {
    baseUrl: API_BASE_URL,
    endpoint: {
        weeklyMod: {
            getAll: "/api/MODSemanal/Getall",
            getByWeek: "/api/MODSemanal/GetByWeek/",
            downloadReport: "/api/MODSemanal/GenerateWeeklyReport",
            create: "/api/MODSemanal/CreateWeeklyPlan",
            update: "/api/MODSemanal/UpdateWeeklyPlan/"
        }
    }
};