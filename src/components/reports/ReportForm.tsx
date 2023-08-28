import React, { useState } from 'react';
import { Card } from 'primereact/card';
import { Dropdown } from 'primereact/dropdown';
import { Calendar, CalendarChangeEvent } from 'primereact/calendar';
import { ReportType } from '../../interfaces/ReportType';
import { Insured } from '../../interfaces/Insured';
import { QuestionForm } from '../questions/QuestionForm';
import { windReportQuestions } from './data';

export interface Input {
  id: number;
  label: string;
  name: string;
  value: string;
  suffix?: string;
  type?: "number" | "mask" | "text" | "multiline";
}
export interface Answer {
  id: number;
  answer: string;
  questionId: number;
  renderInput?: boolean;
  paragraphText?: string;
}

export interface Question {
  answers?: Answer[];
  id: number;
  inputs?: Input [];
  isMultipleChoice: boolean;
  isYesNoQuestion: boolean;
  question: string;
}

export const ReportForm: React.FC = () => {
  const [selectedAnswers, setSelectedAnswers] = useState<Answer[]>([]);
  const [selectedReportType, setSelectedReportType] = useState<ReportType[]>([]);
  const [selectedInsured, setSelectedInsured] = useState<Insured[]>();
  const [selectedDate, setSelectedDate] = useState<string | Date | Date[]>();
  const [selectedReport, setSelectedReport] = useState<Question[]>(windReportQuestions);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const [paragraphs, setParagraphs] = useState<string[]>([]);

  const handleAnswerChange = (value: Array<Answer>) => {
    setSelectedAnswers(value);
  };
  
  const handleNext = () => {
    const paragraph = selectedAnswers[selectedAnswers.length - 1].paragraphText!;
    const mapIdAnswers = selectedAnswers.map(answer => answer.id);
    const mapAnswers = selectedAnswers.map(answer => answer.answer);
    
    const nextQuestionMapping: { [key: string]: number | null } = {
      '0': mapIdAnswers.includes(6) ? 1 : 2,
      '1': 2,
      '2': mapIdAnswers.includes(3) ? 3 : 5,
      '3': 4,
      '4': 5,
      '5': mapIdAnswers.includes(16) ? 6 : 7,
      '6': 7,
      '7': 8,
      '8': 9,
      '9': mapIdAnswers.includes(27) ? 10 : null,
      '10': mapIdAnswers.includes(28) ? 11 : 12,
      '11': 12
    };

    if(paragraph) {
      let resultParagraph = paragraph?.replace('{answers}', mapAnswers.join(', ')).replace('{date}', selectedDate!.toLocaleString('es', { day: '2-digit', month: '2-digit', year: 'numeric' }));

      setParagraphs([...paragraphs, resultParagraph]);
    }


    const nextIndex = nextQuestionMapping[currentQuestionIndex.toString()];
    if (nextIndex !== null) {
      setCurrentQuestionIndex(nextIndex);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    const mapIdAnswers = selectedAnswers.map(answer => answer.id);

    const prevQuestionMapping: { [key: string]: number | null } = {
      '1': 0,
      '2': mapIdAnswers.includes(6) ? 1 : 0,
      '3': 2,
      '4': 3,
      '5': mapIdAnswers.includes(3) ? 4 : 2,
      '6': 5,
      '7': 5,
      '8': mapIdAnswers.includes(17) ? 7 : 6,
      '9': 8,
      '10': 9,
      '11': 10,
      '12': 11,
      '13': 11
    };

    const prevIndex = prevQuestionMapping[currentQuestionIndex.toString()];
    console.log({prevIndex});
    if (prevIndex !== null) {
      setCurrentQuestionIndex(prevIndex);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const currentQuestion = selectedReport![currentQuestionIndex];

  return (
    <Card>
      <div className="p-fluid grid">
        <div className="field col-12 md:col-4">
            <span className="p-float-label">
              <Dropdown value={selectedReportType} onChange={(e) => setSelectedReportType(e.value)} optionLabel="name"
                filter className="w-full" />
                <label htmlFor="ac">Tipo de Informe</label>
            </span>
          </div>
          <div className="field col-12 md:col-4">
            <span className="p-float-label">
              <Dropdown value={selectedInsured} onChange={(e) => setSelectedInsured(e.value)}  optionLabel="fullname"
                filter className="w-full" />
                <label htmlFor="ac">Asegurado</label>
            </span>
          </div>
          <div className="field col-12 md:col-4">
            <span className="p-float-label">
              <Calendar className="w-full" inputId="date" locale="es" value={selectedDate} onChange={(e: CalendarChangeEvent) => e.value && setSelectedDate(e.value)} showIcon maxDate={new Date()} />
              <label htmlFor="date">Fecha</label>
            </span>
          </div>
      {
        selectedDate ?
          <QuestionForm
            currentQuestion={currentQuestion}
            currentCuestionIndex={currentQuestionIndex}
            handlePrevious={handlePrevious}
            handleNext={handleNext}
            onAnswerChange={handleAnswerChange}
            questions={windReportQuestions}
            selectedAnswers={selectedAnswers}
          />
      : <span>Seleccione tipo de informe, asegurado y fecha</span>
      }
        <div className="field col-12">
          <p className="text-red-500">{JSON.stringify(paragraphs)}</p>
        </div>
      </div>
    </Card>
  );
};