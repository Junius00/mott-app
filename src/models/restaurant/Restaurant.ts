import Set from './Set';

export type restaurantInput = {
    name: string,
    _id: string,
    openingTime: number,
    closingTime: number,
    sets: Array<Set>
}

export default class Restaurant {
    name: string;
    _id: string;
    openingTime: string;
    closingTime: string;
    sets: Array<Set>;

    getTimeStr(timeNumber: number) {
        let timeOfDay = 'am';

        if (timeNumber > 1200) {
            timeNumber -= 1200;
            timeOfDay = 'pm';
        }

        let timeStr = timeNumber < 1000 ? '0' : '';
        timeStr += timeNumber.toString();

        return timeStr.slice(0, 2) + ':' + timeStr.slice(2) + timeOfDay;
    }

    constructor(restaurantInput: restaurantInput) {
        //convert opening and closing time from number to string

        this.name = restaurantInput.name;
        this._id = restaurantInput._id;
        this.openingTime = this.getTimeStr(restaurantInput.openingTime);
        this.closingTime = this.getTimeStr(restaurantInput.closingTime);
        this.sets = restaurantInput.sets;
    }
}