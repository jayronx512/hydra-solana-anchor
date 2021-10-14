export let accountData = [
    {
        username: "jj",
        password: "1234",
        name: "Jing Jong",
        idType: "National Identification",
        idNumber: "1234",
        email: "yeowjingjong@gmail.com",
        // solanaAccount: {
        //     publicKey: "58ejtE24hDHXQKPMsqCRoSTdYrbb8DACxLZyE8jWDHvh",
        //     secretKey: "[85,151,16,250,166,121,224,166,219,220,159,231,107,123,172,248,228,250,91,197,143,132,38,156,102,147,209,95,216,92,134,108,241,245,153,79,163,191,132,218,187,28,151,160,125,143,130,42,155,82,145,242,244,6,4,137,204,56,69,73,52,3,230,234]",
        //     balance: 0
        // },
        solanaAccount: {
            publicKey: "",
            secretKey: "",
            balance: 0
        },
        accountList: [
            // {
            //     name: "Personal USD Wallet",
            //     currency: "USD",
            //     publicKey: "993eaYTYu3ZamnmqtX3hudk9dCz6oEWjtrcFE39Zti6t",
            //     secretKey: "[222,21,250,173,164,23,166,172,142,42,127,81,29,201,201,45,154,85,196,39,205,229,167,20,152,166,76,2,117,76,16,96,120,237,34,200,193,43,67,84,193,215,145,90,26,67,114,195,111,201,75,213,90,244,24,46,139,150,148,150,118,98,14,17]",
            //     solBalance: 0,
            //     balance: 0,
            //     transactionList: [
            //         {
            //             signature: "jashdsaodskadsadsaldasdsa",
            //             amount: 0.0005
            //         },
            //         {
            //             signature: "231hlsadjsaodjo1j3o2132o1",
            //             amount: -0.001
            //         }
            //     ]
            // }
        ],
        payeeList: [
            {
                name: "Bushan's USD Wallet",
                publicKey: "6AfphVidJHx5EsUSHdwC8R3T3PzAj4czTuyjfh3avSq6",
                // remove this later
                secretKey: "[56,36,9,186,109,78,70,163,183,70,18,107,72,91,137,5,86,235,245,25,122,44,205,127,143,21,114,98,167,4,37,40,75,186,255,22,234,56,232,11,221,217,104,247,224,154,148,174,73,79,95,236,249,68,34,204,12,176,123,233,123,135,148,142]",
                email: "bushan@gmail.com",
                nickname: "Bushan",
                currency: "USD"
            }
        ]
    },
    {
        username: "bushan",
        password: "1234",
        name: "Bushan",
        idType: "National Identification",
        idNumber: "1234",
        email: "bushan@gmail.com",
        solanaAccount: {
            publicKey: "",
            secretKey: "",
            balance: 0
        },
        accountList: [
            // {
            //     name: "Business USD Wallet",
            //     currency: "USD",
            //     publicKey: "66cxZVY2XGBvsHCQD3AcCrNsSA3r5dc7x36A1PYGvucy",
            //     secretKey: "[56,36,9,186,109,78,70,163,183,70,18,107,72,91,137,5,86,235,245,25,122,44,205,127,143,21,114,98,167,4,37,40,75,186,255,22,234,56,232,11,221,217,104,247,224,154,148,174,73,79,95,236,249,68,34,204,12,176,123,233,123,135,148,142]",
            //     solBalance: 0,
            //     balance: 0,
            //     transactionList: [
            //         {
            //             signature: "231hlsadjsaodjo1j3o2132o1",
            //             amount: -0.001
            //         }
            //     ]
            // }
        ],
        payeeList: [
            {
                name: "JJ's USD Wallet",
                publicKey: "993eaYTYu3ZamnmqtX3hudk9dCz6oEWjtrcFE39Zti6t",
                // remove this later
                secretKey: "[222,21,250,173,164,23,166,172,142,42,127,81,29,201,201,45,154,85,196,39,205,229,167,20,152,166,76,2,117,76,16,96,120,237,34,200,193,43,67,84,193,215,145,90,26,67,114,195,111,201,75,213,90,244,24,46,139,150,148,150,118,98,14,17]",
                email: "yeowjingjong@gmail.com",
                nickname: "JJ",
                currency: "USD"
            }
        ]
    }
]

export let colorList = [
    "#42a4f5",
    "#5c6bc0",
    "#7e57c2",
    "#26a69a",
    "#d4e157",
    "#eeff41",
    "#b2ff59",
    "#69f0ae",
    "#d4e157",
    "#84ffff",
    "#80cbc4",
    "#80deea",
    "#81d4fa",
    "#c5cae9",
    "#ffe57f",
    "#ffccbc"
]
