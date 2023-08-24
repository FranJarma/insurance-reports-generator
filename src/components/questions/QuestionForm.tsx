import React, { ChangeEvent, useState } from 'react';
import { RadioButton } from 'primereact/radiobutton';
import { Checkbox } from 'primereact/checkbox';
import { InputTextarea } from 'primereact/inputtextarea';
import { Answer, Question } from '../reports/ReportForm';
import { Button } from 'primereact/button';
import { PrimeIcons } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import { InputNumber, InputNumberChangeEvent, InputNumberValueChangeEvent } from 'primereact/inputnumber';

interface QuestionFormProps {
  answers: Array<Answer>;
  currentQuestion: Question;
  currentCuestionIndex: number;
  isMultipleChoice: boolean;
  isYesNoQuestion: boolean;
  question: Question;
  questions: Array<Question>,
  selectedAnswers: Array<Answer>;
  handleNext: () => void;
  handlePrevious: () => void;
  onAnswerChange: (selectedAnswers: Array<Answer>) => void;
}

export const QuestionForm: React.FC<QuestionFormProps> = ({
  answers,
  currentQuestion,
  currentCuestionIndex,
  isMultipleChoice,
  isYesNoQuestion,
  question,
  questions,
  selectedAnswers,
  handlePrevious,
  handleNext,
  onAnswerChange,
}) => {
  const [selectedYesNoMap, setSelectedYesNoMap] = useState<{ [key: string]: string | null }>({});
  const [inputTextValues, setInputTextValues] = useState<{ [key: string]: string }>({});
  const [inputNumberValues, setInputNumberValues] = useState<{ [key: string]: number }>({});
  const [inputTextAreaValues, setInputTextAreaValues] = useState<{ [key: string]: string }>({});

  const handleInputChange = (inputName: string, value: string) => {
    setInputTextValues(prevValues => ({ ...prevValues, [inputName]: value }));
  };
  
  const handleInputNumberChange = (inputName: string, value: number) => {
    setInputNumberValues(prevValues => ({ ...prevValues, [inputName]: value }));
  };
  
  const handleInputTextAreaChange = (inputName: string, value: string) => {
    setInputTextAreaValues(prevValues => ({ ...prevValues, [inputName]: value }));
  };

  const handleYesNoChange = (answer: Answer) => {
    setSelectedYesNoMap((prevMap) => ({
      ...prevMap,
      [question.id]: answer.answer,
    }));

    const updatedSelectedAnswers = selectedAnswers.filter((a) => a.questionId !== question.id);

    const existingIndex = updatedSelectedAnswers.findIndex((a) => a.questionId === answer.questionId);
    if (existingIndex !== -1) {
      updatedSelectedAnswers.splice(existingIndex, 1);
    }

    if (answer.answer === 'Si' || answer.answer === 'No') {
      updatedSelectedAnswers.push(answer);
    }

    onAnswerChange(updatedSelectedAnswers);
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
      updatedSelectedAnswers.push({ ...answer, questionId: question.id });
    }

    // Actualizar el estado con la nueva lista de updatedSelectedAnswers
    onAnswerChange(updatedSelectedAnswers);
  };

  return (
    <React.Fragment>
      <h4 className="col-12">{question.question}</h4>
      {
        question.inputs?.map(input => (
          <div className="col-12 lg:col-6">
            <label htmlFor={input.name} className="block mb-2">{input.label}</label>
            {
              input.type === "number" ?
              <InputNumber
                className="mb-4"
                id={input.name}
                name={input.name}
                // onChange={(e: InputNumberValueChangeEvent) => handleInputChange(input.name, e.value!.toString())}
                suffix={input.suffix ?? ""}
                value={Number(input.value)}
              />
              :
              <InputText
                className="mb-4"
                id={input.name}
                name={input.name}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange(input.name, e.target.value)}
                value={input.value}
            />
            }
          </div>
        ))
      }
      {
        question.isWritable ?
        <InputTextarea  className="mb-5 ml-2 mr-2" rows={12} cols={12} placeholder="Redactar" />
      :
      answers.map((answer) => (
        <div className="field-checkbox col-6 gap-1" key={answer.answer}>
          {isYesNoQuestion && !isMultipleChoice ? (
            <RadioButton
              className="field-radiobutton"
              name={question.id.toString()} // Agrupa los RadioButtons por el id de la pregunta
              value={answer.answer}
              checked={selectedYesNoMap[question.id] === answer.answer}
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
        <div className="flex md:w-6 md:flex-row w-full flex-column ml-auto gap-5">
          <Button icon={PrimeIcons.CHEVRON_CIRCLE_LEFT} outlined onClick={handlePrevious} disabled={currentCuestionIndex === 0}>
            Anterior
          </Button>
          <Button icon={PrimeIcons.CHEVRON_CIRCLE_RIGHT} severity="success" onClick={handleNext} disabled={currentCuestionIndex === questions.length - 1 || (!currentQuestion.isWritable && selectedAnswers.filter(a => a.questionId === currentQuestion.id).length === 0)}>
            Siguiente
          </Button>
        </div>
      </React.Fragment>
    </React.Fragment>
  );
};
