const match = <T,>(cases: [boolean, () => T][]): T | null => {
    for (const [condition, fn] of cases) {
        if (condition) return fn();
    }
    return null;
};

export default match;