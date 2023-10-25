export class Ingredient {
    public name: string;
    public amount: number;

    constructor(name: string, amount: number) {
        this.name = name;
        this.amount = amount;
    };

    // Or you can use a shorter version instead of everything above:
    // constructor(public name: string, public amount: number) {}
    
 
}