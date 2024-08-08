import { Calendar, CalendarChangeEvent } from 'primereact/calendar'
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown'
import { Insured } from '../../interfaces/Models';
import { FC, useEffect } from 'react';
import { ReportType } from '../../interfaces/Models/ReportType';
import { fireReportQuestions, waterReportQuestions, windReportQuestions } from './data';
import { Question } from './ReportForm';

interface FormFilterProps {
    currentQuestionIndex: number;
    selectedReportType: ReportType | undefined;
    selectedInsured: Insured | undefined;
    selectedDate: string | Date | undefined;
    setSelectedDate: React.Dispatch<React.SetStateAction<string | Date | undefined>>;
    setSelectedInsured: React.Dispatch<React.SetStateAction<Insured | undefined>>;
    setSelectedReportType: React.Dispatch<React.SetStateAction<ReportType | undefined>>;
    setSelectedQuestionnaire: React.Dispatch<React.SetStateAction<Question []>>;
}

export const FormFilter: FC<FormFilterProps> = (props) => {

    useEffect(() => {
      setSelectedReportType(reportTypes[0])
    }, []);

    const { currentQuestionIndex, selectedReportType, selectedInsured, selectedDate, setSelectedReportType, setSelectedInsured, setSelectedDate, setSelectedQuestionnaire } = props;

    const reportTypes: ReportType [] = [
        {
          _id: '6aaccb73-61b3-40be-8cdc-28244a6e1841',
          name: 'Viento'
        },
        {
          _id: '1a4439f1-437e-4a46-ab49-ea2a858163ff',
          name: 'Agua'
        },
        {
          _id: '86a5e2da-21d1-48ac-a788-cdb70cffe720',
          name: 'Fuego'
        }
    ];
  
    const insureds: Insured [] = [
      {
        _id: '6aaccb73-61b3-40be-8cdc-28244a6e1841',
        fullname: 'Francisco Jarma',
      },
      {
        _id: '1a4439f1-437e-4a46-ab49-ea2a858163ff',
        fullname: 'Rodrigo Rodriguez'
      },
      {
        _id: '86a5e2da-21d1-48ac-a788-cdb70cffe720',
        fullname: 'Gonzalo Gonzales'
      }
    ];

    type ReportTarget = {
      [key: string]: Question []
    }

    const selectedReportTargetValue: ReportTarget = {
      'Viento': windReportQuestions,
      'Agua': waterReportQuestions,
      'Fuego': fireReportQuestions
    };

    const handleChangeReportType = (e: DropdownChangeEvent) => {
      setSelectedReportType(e.target.value);
      setSelectedQuestionnaire(selectedReportTargetValue[e.target.value])
    }
    
    return (
        <>
            <div className="field col-12 md:col-4">
                <span className="p-float-label">
                <Dropdown disabled={currentQuestionIndex > 0 ? true : false} options={reportTypes} value={selectedReportType} onChange={handleChangeReportType} optionLabel="name"
                    filter className="w-full" />
                    <label htmlFor="ac">Tipo de Informe</label>
                </span>
            </div>
            <div className="field col-12 md:col-4">
                <span className="p-float-label">
                <Dropdown disabled={currentQuestionIndex > 0 ? true : false} options={insureds} value={selectedInsured} onChange={(e) => setSelectedInsured(e.value)}  optionLabel="fullname"
                    filter className="w-full" />
                    <label htmlFor="ac">Asegurado</label>
                </span>
            </div>
            <div className="field col-9 md:col-3">
                <span className="p-float-label">
                <Calendar disabled={currentQuestionIndex > 0 ? true : false} className="w-full" inputId="date" locale="es" value={selectedDate} onChange={(e: CalendarChangeEvent) => e.value && setSelectedDate(e.value)} showIcon maxDate={new Date()} />
                <label htmlFor="date">Fecha</label>
                </span>
            </div>
        </>
    )
}
