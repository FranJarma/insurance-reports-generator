import React, { ChangeEvent, useState } from 'react';
import { RadioButton } from 'primereact/radiobutton';
import { Checkbox } from 'primereact/checkbox';
import { InputTextarea } from 'primereact/inputtextarea';
import { Answer, Question } from '../reports/ReportForm';
import { Button } from 'primereact/button';
import { PrimeIcons } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import { InputNumber, InputNumberChangeEvent } from 'primereact/inputnumber';

interface QuestionFormProps {
  currentQuestion: Question;
  currentCuestionIndex: number;
  questions: Array<Question>,
  selectedAnswers: Array<Answer>;
  handleNext: () => void;
  handlePrevious: () => void;
  onAnswerChange: (selectedAnswers: Array<Answer>) => void;
}

export const QuestionForm: React.FC<QuestionFormProps> = ({
  currentQuestion,
  currentCuestionIndex,
  questions,
  selectedAnswers,
  handlePrevious,
  handleNext,
  onAnswerChange,
}) => {
  const [selectedYesNoMap, setSelectedYesNoMap] = useState<{ [key: string]: string | null }>({});
  const [inputTextValues, setInputTextValues] = useState<{ [key: string]: string }>({});

  const { answers, id, isMultipleChoice, isYesNoQuestion, inputs } = currentQuestion;

  const handleInputChange = (inputName: string, value: string) => {
    console.log(inputTextValues);
    setInputTextValues({
      ...inputTextValues,
      [inputName] : value
    });
  
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
      updatedSelectedAnswers.push({ ...answer, questionId: id });
    }

    // Actualizar el estado con la nueva lista de updatedSelectedAnswers
    onAnswerChange(updatedSelectedAnswers);
  };

  return (
    <React.Fragment>
      <h4 className="col-12">{currentQuestion.question}</h4>
      {
        inputs ? inputs?.map(input => (
          <div className={inputs.length > 1 ? "col-12 lg:col-6" : "col-12"}>
            <label htmlFor={input.name} className="block mb-2">{input.label}</label>
            {
              input.type === "number" ?
              <InputNumber
                id={input.name}
                name={input.name} 
                onChange={(e: InputNumberChangeEvent) => handleInputChange(input.name, e.value!.toString())}
                placeholder="Redactar"
                suffix={input.suffix ?? ""}
                value={Number(inputTextValues[input.name])}
              />
              : input.type === "multiline" ?
              <InputTextarea
                cols={12}
                id={input.name}
                name={input.name} 
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleInputChange(input.name, e.target.value)}
                placeholder="Redactar"
                rows={12}
                value={inputTextValues[input.name]}/>
              :
              <InputText
                className="mb-4"
                id={input.name}
                name={input.name}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange(input.name, e.target.value)}
                value={inputTextValues[input.name]}
            />
            }
          </div>
        ))
      :
      answers!.map((answer) => (
        <div className="field-checkbox col-6 gap-1" key={answer.answer}>
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
        <div className="flex md:w-6 md:flex-row w-full flex-column ml-auto gap-5">
          <Button icon={PrimeIcons.CHEVRON_CIRCLE_LEFT} outlined onClick={handlePrevious} disabled={currentCuestionIndex === 0}>
            Anterior
          </Button>
          <Button icon={PrimeIcons.CHEVRON_CIRCLE_RIGHT} severity="success" onClick={handleNext} disabled={currentCuestionIndex === questions.length - 1 || (selectedAnswers.filter(a => a.questionId === currentQuestion.id).length === 0) || (inputs?.length > 0 && Object.values(inputTextValues).every(value => value.trim() !== ''))}>
            Siguiente
          </Button>
        </div>
      </React.Fragment>
    </React.Fragment>
  );
};
