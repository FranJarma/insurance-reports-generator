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
      try {
        const reportService = new ReportService();
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
  }, []); // Dependencia vacía para ejecutar el efecto solo una vez al montar el componente

  return { reports, loading, error };
}
