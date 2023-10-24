export const findMatchesByRegex = (regex: RegExp, string: string) => {

    const matches = [];
    let match;

    while ((match = regex.exec(string)) !== null) {
    matches.push(match[1]);
    }

    return matches;
}