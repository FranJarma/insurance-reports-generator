import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { calculateColumnClass, findMatchesByRegex, generateInputField, handleNextQuestionMapping, handlePreviousQuestionMapping, replaceParagraphs } from '../../helpers';
import { Card } from 'primereact/card';
import { Checkbox } from 'primereact/checkbox';
import { Dialog } from 'primereact/dialog';
import { FormFilter } from './FormFilter';
import { InputTextarea } from 'primereact/inputtextarea';
import { Insured } from '../../interfaces/Insured';
import { PrimeIcons } from 'primereact/api';
import { RadioButton } from 'primereact/radiobutton';
import { ReportType } from '../../interfaces/ReportType';
import { windReportQuestions } from './data';

type InputType = "number" | "mask" | "text" | "multiline"
export interface Input {
  id: number;
  label?: string;
  name: string;
  value: string | number;
  suffix?: string;
  type?: InputType;
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
  const [selectedYesNoMap, setSelectedYesNoMap] = useState<{ [key: string]: string | null }>({});
  const [inputTextValues, setInputTextValues] = useState<{ [key: string]: string }>({});
  const currentQuestion = selectedReport![currentQuestionIndex];
  const keysRegex = /{([^}]+)}/g;

  const { answers, id, isMultipleChoice, isYesNoQuestion, inputs } = currentQuestion ?? {};

  const handleAnswerChange = (value: Array<Answer>) => {
    setSelectedAnswers(value);
  };
  
  const handleInputChange = (inputName: string, value: string, answerId: number) => {
    setInputTextValues({
      ...inputTextValues,
      [inputName] : value
    });
    
    const updatedSelectedAnswers = selectedAnswers.filter((a) => a.questionId !== id);
    if(inputs?.length === 0){
      const newAnswer = {
        answer: value,
        id: answerId,
        paragraphText: value,
        questionId: id
      };
      updatedSelectedAnswers.push(newAnswer);
    }

    handleAnswerChange(updatedSelectedAnswers);
  };
  
  const handleYesNoChange = (answer: Answer) => {
    setSelectedYesNoMap((prevMap) => ({
      ...prevMap,
      [id]: answer.answer,
    }));

    const updatedSelectedAnswers = selectedAnswers.filter((a) => a.questionId !== id);

    const existingIndex = updatedSelectedAnswers.findIndex((a) => a.questionId === answer.questionId);
    if (existingIndex !== -1) {
      updatedSelectedAnswers.splice(existingIndex, 1);
    }

    if (answer.answer === 'Si' || answer.answer === 'No') {
      updatedSelectedAnswers.push(answer);
    }

    handleAnswerChange(updatedSelectedAnswers);
  };

  const handleAnswerToggle = (answer: Answer) => {
    const updatedSelectedAnswers = [...selectedAnswers];

    // Si la pregunta no es yesOrNoQuestion y no es multipleChoice, validar que no haya mas de una respuesta

    if(!isMultipleChoice && !isYesNoQuestion) {
      const existingIndex = updatedSelectedAnswers.findIndex((a) => a.questionId === answer.questionId);
      if (existingIndex !== -1) {
        updatedSelectedAnswers.splice(existingIndex, 1);
      }
    }
    // Si la respuesta ya está en updatedSelectedAnswers, quitarla
    const existingIndex = updatedSelectedAnswers.findIndex((a) => a.id === answer.id);
    if (existingIndex !== -1) {
      updatedSelectedAnswers.splice(existingIndex, 1);
    } else {
      updatedSelectedAnswers.push({ ...answer, questionId: id });
    }

    // Actualizar el estado con la nueva lista de updatedSelectedAnswers
    handleAnswerChange(updatedSelectedAnswers);
  };

  const handleNext = () => {
    const paragraph = selectedAnswers[selectedAnswers.length - 1].paragraphText!;
    const mapIdAnswers = selectedAnswers.map(answer => answer.id);
    const mapAnswers = selectedAnswers.map(answer => answer.answer);
    const nextQuestionMapping = handleNextQuestionMapping(selectedReportType!, mapIdAnswers);

    if(paragraph) {
      let resultParagraph = replaceParagraphs(paragraph, '{answers}', mapAnswers.join(','));
      resultParagraph = replaceParagraphs(paragraph, '{date}', selectedDate!.toLocaleString('es', { day: '2-digit', month: '2-digit', year: 'numeric' }));
      
      const matches = findMatchesByRegex(keysRegex, resultParagraph);

      if(matches.length > 0){
        matches.map((match) => {
          resultParagraph = replaceParagraphs(paragraph, `{${match}}`, inputTextValues[match]);
        })
      }

      setParagraphs([...paragraphs, resultParagraph]);
    }

    const nextIndex = parseInt(nextQuestionMapping[currentQuestionIndex.toString()]);

    if (nextIndex !== null) {
      setCurrentQuestionIndex(nextIndex);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    const mapIdAnswers = selectedAnswers.map(answer => answer.id);

    const prevQuestionMapping = handlePreviousQuestionMapping(selectedReportType!, mapIdAnswers);

    const prevIndex = parseInt(prevQuestionMapping[currentQuestionIndex.toString()]);

    if (prevIndex !== null) {
      setCurrentQuestionIndex(prevIndex);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

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
                <Button onClick={() => setPreviewDialog(true)} text icon="pi pi-eye" tooltip='Vista previa' tooltipOptions={{ position: 'bottom' }}/>
              </div>
              <h4 className="col-12">{currentQuestion?.question}</h4>
              {
                inputs ?
                inputs?.map(input => (
                  <div key={input.name} className={`${calculateColumnClass(inputs.length)} mb-4`}>
                    <label htmlFor={input.name} className="block mb-2">{input.label}</label>
                      {
                        input.suffix ?
                          <div className='p-inputgroup flex-1'>
                            <span className="p-inputgroup-addon bg-primary">{input.suffix}</span>
                              {
                                generateInputField(input, inputTextValues, handleInputChange)
                              }
                          </div>
                        : generateInputField(input, inputTextValues, handleInputChange)
                      }
                  </div>
                ))
              :
              answers?.map((answer) => (
                <div className="field-checkbox col-6 gap-1" key={answer.id}>
                  {isYesNoQuestion && !isMultipleChoice ? (
                    <RadioButton
                      className="field-radiobutton"
                      name={id.toString()} // Agrupa los RadioButtons por el id de la pregunta
                      value={answer.answer}
                      checked={selectedYesNoMap[id] === answer.answer}
                      onChange={() => handleYesNoChange(answer)}
                    />
                  ) : 
                  !isYesNoQuestion && !isMultipleChoice ?
                  (
                    <RadioButton
                      className="field-radiobutton"
                      value={answer}
                      checked={selectedAnswers.some((a) => a.id === answer.id)}
                      onChange={() => handleAnswerToggle(answer)}
                    />
                  )
                  : (
                    <Checkbox
                      value={answer}
                      checked={selectedAnswers.some((a) => a.id === answer.id)}
                      onChange={() => handleAnswerToggle(answer)}
                    />
                  )}
                  <label className="block w-full">{answer.answer}</label>
                  {answer.renderInput ? (
                    <InputTextarea className="block" placeholder="Detalles" />
                  ) : (
                    ''
                  )}
                </div>
              ))}
              <React.Fragment>
                <div className="flex md:w-4 md:flex-row w-full flex-column ml-auto gap-5">
                  <Button icon={PrimeIcons.CHEVRON_CIRCLE_LEFT} outlined onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
                    Anterior
                  </Button>
                  <Button icon={PrimeIcons.CHEVRON_CIRCLE_RIGHT} severity="success" onClick={handleNext} disabled={currentQuestionIndex === selectedReport.length - 1 || (!inputs && selectedAnswers.filter(a => a.questionId === currentQuestion?.id).length === 0)}>
                    Siguiente
                  </Button>
                </div>
              </React.Fragment>
            </>
          : <div className="field col-12">Seleccione tipo de informe, asegurado y fecha</div>
          }
      </div>
    </Card>
  );
};