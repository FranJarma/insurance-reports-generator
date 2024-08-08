import { useEffect, useState } from 'react';
import { ReportService } from '../../services/ReportService';
import { Report } from '../../interfaces/Models/Report';

// Define un custom hook para obtener informes
export function useGetReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const reportService = new ReportService();
      try {
        const getReportsFunction = reportService.GetReports();
        const data = await getReportsFunction();
        setReports(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { reports, loading, error };
}
