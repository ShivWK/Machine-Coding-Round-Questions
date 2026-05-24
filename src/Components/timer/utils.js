export const TimeFactors = {
    Hour: "Hour",
    Minute: "Minute",
    Second: "Second",
    MilliSeconds: "MilliSeconds"
}

export const Config = {
    [TimeFactors.Hour]: {
        value: "",
        factor: 60 * 60 * 1000,
        placeholder: "00",
    },

    [TimeFactors.Minute]: {
        value: "",
        factor: 60 * 1000,
        placeholder: "00",
    },

    [TimeFactors.Second]: {
        value: "",
        factor: 1000,
        placeholder: "00",
    },

    // [TimeFactors.MilliSeconds]: {
    //     value: "",
    //     factor: 1,
    //     placeholder: "00",
    // },
}