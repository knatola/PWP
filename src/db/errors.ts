export class InsufficientAmountError extends Error {
	constructor(public error: string) {
		super(error);
		Object.setPrototypeOf(this, InsufficientAmountError);
		this.name = "InsufficientAmountError";
	}
}
