interface SetRefInput {
    restaurantId: string,
    setId: string,
}

export default class SetRef {
    quantity: number;
    restaurantId: string;
    setId: string;

    constructor(input: SetRefInput) {
        this.restaurantId = input.restaurantId;
        this.setId = input.setId;
        this.quantity = 0;

        this.addQuantity = this.addQuantity.bind(this);
        this.minusQuantity = this.minusQuantity.bind(this);
    }

    addQuantity(count: number = 1) {
        this.quantity += count;
    }

    minusQuantity(count: number = 1) {
        if (this.quantity < count) return;

        this.quantity -= count;
    }
}