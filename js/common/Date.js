class TimeDate {
    constructor(DOB) {
        DOB = new Date(DOB);
        this.day = DOB.getDay();;
        this.month = DOB.getMonth() + 1;
        this.year = DOB.getFullYear();
    }
    transformDay() {
        return this.day < 10 ? `0${this.day}` : this.day;
    }
    transformMonth() {
        return this.month < 10 ? `0${this.month}` : this.month;
    }
    transformYear() {
        return this.year;
    }
}