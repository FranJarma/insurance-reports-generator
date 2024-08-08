import React, { ChangeEvent, useState } from 'react';
import { RadioButton } from 'primereact/radiobutton';
import { Checkbox } from 'primereact/checkbox';
import { InputTextarea } from 'primereact/inputtextarea';
import { Answer, Question } from '../reports/ReportForm';
import { Button } from 'primereact/button';
import { PrimeIcons } from 'primereact/api';
import { InputText } from 'primereact/inputtext';
import { InputNumber, InputNumberChangeEvent } from 'primereact/inputnumber';
import { calculateColumnClass } from '../../helpers';

interface QuestionFormProps {
  currentQuestion: Question;
  currentQuestionIndex: number;
  paragraphs: string [];
  nextParagraph: string | undefined;
  questions: Array<Question>,
  selectedAnswers: Array<Answer>;
  handleNext: () => void;
  handlePrevious: () => void;
  onAnswerChange: (selectedAnswers: Array<Answer>) => void;
  setParagraphs:  React.Dispatch<React.SetStateAction<string[]>>
}

export const QuestionForm: React.FC<QuestionFormProps> = (props) => {
  const [selectedYesNoMap, setSelectedYesNoMap] = useState<{ [key: string]: string | null }>({});
  const [inputTextValues, setInputTextValues] = useState<{ [key: string]: string }>({});
  const { currentQuestion, currentQuestionIndex, nextParagraph, paragraphs, questions, selectedAnswers, handlePrevious, handleNext, onAnswerChange, setParagraphs } = props;
  const { answers, id, isMultipleChoice, isYesNoQuestion, inputs } = currentQuestion;

  const handleInputChange = (inputName: string, value: string, answerId: number) => {
    setInputTextValues({
      ...inputTextValues,
      [inputName] : value
    });
    
    const updatedSelectedAnswers = selectedAnswers.filter((a) => a.questionId !== id);
    const newAnswer = {
      answer: value,
      id: answerId,
      paragraphText: value,
      questionId: id
    };
    if(inputs && inputs.length > 0) {
      console.log({nextParagraph, inputName, value})
      const resultParagraph = nextParagraph?.replace(`{${inputName}}`, value)
      setParagraphs([...paragraphs, resultParagraph]);
    }
    updatedSelectedAnswers.push(newAnswer);
    onAnswerChange(updatedSelectedAnswers);
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
          <div key={input.name} className={calculateColumnClass(inputs.length)}>
            <label htmlFor={input.name} className="block mb-2">{input.label}</label>
            {
              input.type === "number" ?
              <InputNumber
                id={input.name}
                name={input.name} 
                onChange={(e: InputNumberChangeEvent) => handleInputChange(input.name, e.value!.toString(), input.id)}
                placeholder="Redactar"
                suffix={input.suffix ?? ""}
                value={Number(inputTextValues[input.name])}
              />
              : input.type === "multiline" ?
              <InputTextarea
                autoResize 
                cols={12}
                id={input.name}
                name={input.name} 
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => handleInputChange(input.name, e.target.value, input.id)}
                placeholder="Redactar"
                rows={12}
                value={inputTextValues[input.name]}/>
              :
              <InputText
                className="mb-4"
                id={input.name}
                name={input.name}
                onChange={(e: ChangeEvent<HTMLInputElement>) => handleInputChange(input.name, e.target.value, input.id)}
                value={inputTextValues[input.name]}
            />
            }
          </div>
        ))
      :
      answers!.map((answer) => (
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
          <Button icon={PrimeIcons.CHEVRON_CIRCLE_RIGHT} severity="success" onClick={handleNext} disabled={currentQuestionIndex === questions.length - 1 || (!inputs && selectedAnswers.filter(a => a.questionId === currentQuestion.id).length === 0)}>
            Siguiente
          </Button>
        </div>
      </React.Fragment>
    </React.Fragment>
  );
};
