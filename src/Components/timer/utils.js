export const TimeFactors = {
    Hour: "Hour",
    Minute: "Minute",
    Second: "Second",
    MilliSeconds: "MilliSeconds"
}

export const Config = {
    [TimeFactors.Hour]: {
        value: "",
        placeholder: "00",
    },

    [TimeFactors.Minute]: {
        value: "",
        placeholder: "00",
    },

    [TimeFactors.Second]: {
        value: "",
        placeholder: "00",
    },

    //     [TimeFactors.MilliSeconds]: {
    //         value: "",
    //         placeholder: "00",
    //     },
}

export const OrderOfTimer = [TimeFactors.Hour, TimeFactors.Minute, TimeFactors.Second];
