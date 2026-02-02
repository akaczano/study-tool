export const filterCases = (cases: string[], language: string) => {
    return cases.filter((c: string) => {
        if (language === "GREEK" && c === "ABLATIVE") return false;
        return true;
    })

}