export const TimeFactors = {
    Hour: "hh",
    Minute: "mm",
    Second: "ss",
    MilliSeconds: "ms"
}

export const Config = {
    [TimeFactors.Hour]: {
        value: "",
        factor: 60 * 60 * 1000,
        placeholder: "HH"
    },

    [TimeFactors.Minute]: {
        value: "",
        factor: 60 * 1000,
        placeholder: "MM"
    },

    [TimeFactors.Second]: {
        value: "",
        factor: 1000,
        placeholder: "SS"
    },

    // [TimeFactors.MilliSeconds]: {
    //     value: "",
    //     factor: 1,
    //     placeholder: "MS"
    // },
}