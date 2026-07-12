
const calculateCO2 = (quantity, emissionFactor) => {
    const factor =
        typeof emissionFactor === "number"
            ? emissionFactor
            : emissionFactor.factor;

    return Number((quantity * factor).toFixed(2));
};

export default calculateCO2;