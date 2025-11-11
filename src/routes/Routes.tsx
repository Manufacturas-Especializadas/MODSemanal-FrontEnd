import { Route, Routes } from "react-router-dom";
import { WeeklyModIndex } from "../pages/WeeklyMod/WeeklyModIndex";
import { ReportsIndex } from "../pages/Reports/ReportsIndex";

export const MyRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<WeeklyModIndex />} />

            <Route path="/reportes-semanales" element={<ReportsIndex />} />
        </Routes>
    );
};