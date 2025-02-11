export const fetchExcuses = async (category, reason) => {
    // Simuler un appel API (à remplacer par une requête réelle)
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                `Excuse 1 pour ${category} - ${reason}`,
                `Excuse 2 pour ${category} - ${reason}`,
                `Excuse 3 pour ${category} - ${reason}`,
                `Excuse 4 pour ${category} - ${reason}`,
                `Excuse 5 pour ${category} - ${reason}`,
            ]);
        }, 1000);
    });
};
