import { IReportQuery } from '../interfaces/Queries/ReportQuery';
import { Report } from '../interfaces/Models';
import { supabase } from '../supabase/client';

export class ReportService implements IReportQuery {
    GetReports(): () => Promise<Report[]> {
      const fetchReports = async () => {
        const { data: reports, error } = await supabase.from('reports').select(`
          code, 
          sinister,
          created_date:created_at::date,
          created_time:created_at::time,
          insured(*)
        `);
        
        if (error) {
          throw error;
        }

        return reports as Report[];

      };
      return fetchReports;
    }
}
