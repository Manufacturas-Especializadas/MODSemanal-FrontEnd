import { Route, Routes } from "react-router-dom";
import { WeeklyModIndex } from "../pages/WeeklyMod/WeeklyModIndex";

export const MyRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<WeeklyModIndex />} />
        </Routes>
    );
};