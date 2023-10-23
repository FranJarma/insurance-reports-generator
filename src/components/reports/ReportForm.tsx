import React, { useState } from 'react';
import { Card } from 'primereact/card';
import { ReportType } from '../../interfaces/ReportType';
import { Insured } from '../../interfaces/Insured';
import { QuestionForm } from '../questions/QuestionForm';
import { windReportQuestions } from './data';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { handleNextQuestionMapping, handlePreviousQuestionMapping } from '../../helpers';
import { FormFilter } from './FormFilter';

export interface Input {
  id: number;
  label?: string;
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
  const [selectedReport, setSelectedReport] = useState<Question[]>(windReportQuestions);
  const [selectedInsured, setSelectedInsured] = useState<Insured | undefined>();
  const [selectedDate, setSelectedDate] = useState<string | Date | undefined>();
  const [selectedReportType, setSelectedReportType] = useState<ReportType | undefined>();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [paragraphs, setParagraphs] = useState<string[]>([]);
  const [previewDialog, setPreviewDialog] = useState(false);

  const handleAnswerChange = (value: Array<Answer>) => {
    setSelectedAnswers(value);
  };
  
  const handleNext = () => {
    const paragraph = selectedAnswers[selectedAnswers.length - 1].paragraphText!;
    const mapIdAnswers = selectedAnswers.map(answer => answer.id);
    const mapAnswers = selectedAnswers.map(answer => answer.answer);
    
    const nextQuestionMapping = handleNextQuestionMapping(selectedReportType!, mapIdAnswers);

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

    const prevQuestionMapping = handlePreviousQuestionMapping(selectedReportType!, mapIdAnswers);

    const prevIndex = prevQuestionMapping[currentQuestionIndex.toString()];

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
        <FormFilter
          currentQuestionIndex={currentQuestionIndex}
          selectedDate={selectedDate}
          selectedInsured={selectedInsured}
          selectedReportType={selectedReportType}
          setSelectedDate={setSelectedDate}
          setSelectedInsured={setSelectedInsured}
          setSelectedReportType={setSelectedReportType}
        />
          <Dialog header="Vista previa del informe" maximizable style={{ width: '50vw' }} draggable={false} visible={previewDialog} onHide={() => setPreviewDialog(false)}>
            <div className="field col-12">
              {
                paragraphs.map((paragraph: string) => (
                  <p className="text-red-500 mb-5">{paragraph}</p>
                ))
              }
            </div>
          </Dialog>
          {
            selectedDate ?
            <>
              <div className="field col-12 md:col-1">
                <Button onClick={() => setPreviewDialog(true)} text icon="pi pi-eye" title='Vista previa'/>
              </div>
              <QuestionForm
                currentQuestion={currentQuestion}
                currentCuestionIndex={currentQuestionIndex}
                handlePrevious={handlePrevious}
                handleNext={handleNext}
                onAnswerChange={handleAnswerChange}
                questions={windReportQuestions}
                selectedAnswers={selectedAnswers}
              />
            </>
          : <div className="field col-12">Seleccione tipo de informe, asegurado y fecha</div>
          }
      </div>
    </Card>
  );
};