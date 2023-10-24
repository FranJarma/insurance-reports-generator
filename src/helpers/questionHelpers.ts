import { ReportType } from '../interfaces/ReportType';
export const handleNextQuestionMapping = (selectedReportType: ReportType, mapIdAnswers: number []): { [key: string]: string } => {
    let nextQuestionMapping = {};
    if(selectedReportType.name === "Viento"){
        nextQuestionMapping = {
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
    }
    return nextQuestionMapping;
}

export const handlePreviousQuestionMapping = (selectedReportType: ReportType, mapIdAnswers: number []): { [key: string]: string } => {
    let previousQuestionMapping = {};
    if(selectedReportType.name === "Viento"){
        previousQuestionMapping = {
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
    }
    return previousQuestionMapping;
}
export const replaceParagraphs = (paragraph: string, stringToReplace: string, replaceItem: string) => {
    return paragraph?.replace(stringToReplace, replaceItem);
}