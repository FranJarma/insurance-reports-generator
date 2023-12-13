import { Report } from '../interfaces/Models';
import { IReportQuery } from '../interfaces/Queries/ReportQuery';
import { supabase } from '../supabase/client';

export class ReportService implements IReportQuery {
    GetReports(): () => Promise<Report[]> {
      const fetchReports = async () => {
        const { data: reports, error } = await supabase.from('reports').select('*');
  
        if (error) {
          throw error;
        }
        console.log(reports);
        return reports as Report[];

      };
      return fetchReports;
    }
  }
