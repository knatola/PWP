import { Response } from "express";

export const success = (res: Response, body: any): void => {
	res.status(200)
		.send(body);
};

export const notFound = (res: Response): void => {
	res.status(404).send({ message: "Resource not found" });
};

export const badRequest = (res: Response, message = "Bad request"): void => {
	res.status(400).send({ message });
};

export const serverError = (res: Response, message = "Something went wrong"): void => {
	res.status(500).send({ message });
};

export const parseIntFallback = (value: string, fallback: number): number => {
	return isNaN(parseInt(value, 10)) ? fallback : parseInt(value, 10);
};