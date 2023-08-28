export const calculateColumnClass = (inputCount: number) =>
    {
        if (inputCount === 1) return "col-12";
        if (inputCount === 2) return "col-12 lg:col-6";
        if (inputCount >= 3) return "col-12 lg:col-4";
        return "";
    }
