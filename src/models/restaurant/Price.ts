type priceInput = {
    currency: string,
    value: number
}

export default class Price {
    currency: string;
    value: number;

    constructor(priceInput: priceInput) {
        this.currency = priceInput.currency;
        this.value = priceInput.value;
    }
}