import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { ChangeEvent } from 'react';
import { Input } from '../components/reports/ReportForm';
export const calculateColumnClass = (inputCount: number) => {
    if (inputCount === 1) return "col-12";
    if (inputCount === 2) return "col-12 lg:col-6";
    if (inputCount >= 3) return "col-12 lg:col-4";
    return "";
};

export const generateInputField = (input: Input, inputTextValues: { [key: string]: string }, handleInputChange: (inputName: string, value: string, answerId: number) => void) => {
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      handleInputChange(input.name, e.target.value, input.id);
    };
  
    if (input.type === "multiline") {
      return (
        <InputTextarea
          autoResize
          cols={12}
          id={input.name}
          name={input.name}
          onChange={handleChange}
          rows={12}
          value={inputTextValues[input.name]}
        />
      );
    } else if (input.type === "number") {
      return (
        <InputText
          id={input.name}
          keyfilter="int"
          name={input.name}
          onChange={handleChange}
          value={inputTextValues[input.name]}
        />
      );
    } else {
      return (
        <InputText
          id={input.name}
          name={input.name}
          onChange={handleChange}
          value={inputTextValues[input.name]}
        />
      );
    }
  };