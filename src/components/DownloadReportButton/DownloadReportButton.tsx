import { useWeeklyReport } from "../../hooks/useWeeklyReport";

interface DownloadReportButtonProps {
    weekNumber: number;
    className?: string;
}

export const DownloadReportButton: React.FC<DownloadReportButtonProps> = ({
    weekNumber,
    className = ""
}) => {
    const { generateReport, loading, error } = useWeeklyReport();

    const handleDownload = async () => {
        try {
            await generateReport(weekNumber);
        } catch (err) {
        }
    };

    return (
        <div className={className}>
            <button
                onClick={handleDownload}
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors 
                disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:cursor-pointer"
            >
                {loading ? (
                    <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Generando...
                    </>
                ) : (
                    <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Excel
                    </>
                )}
            </button>
            {error && (
                <p className="text-red-600 text-xs mt-1 text-center">{error}</p>
            )}
        </div>
    );
};