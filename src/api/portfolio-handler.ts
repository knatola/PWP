import { Request, Response } from "express";
import { Portfolio } from "../models/portfolio/portfolio";
import { badRequest, notFound, serverError, success } from "./util";
import { v4 as uuidv4 } from "uuid";
import { PortfolioTransaction } from "../models/portfolio/transaction";
import { modifyHoldings } from "../db/transactions";

export const portfolioGetHandler = async (req: Request, res: Response): Promise<void> => {
	let id: string;
	try {
		id = req.params.portfolioId;
	} catch (e) {
		return badRequest(res);
	}
	try {
		const portfolio = await Portfolio.findOne({ where: { id } });
		const holdings = await portfolio.getHoldings();
		const transactions = await portfolio.getTransactions();

		if (portfolio) {
			const resData = { ...portfolio, holdings, transactions };
			return success(res, resData);
		}
		return notFound(res);
	} catch (e) {
		return serverError(res);
	}
};

export const createPortfolioHandler = async (req: Request, res: Response): Promise<void> => {
	try {
		const id = uuidv4();
		const data = await Portfolio.create({ id });
		return success(res, data.toJSON());
	} catch (e) {
		return serverError(res);
	}
};


export const createTransactionHandler = async (req: Request, res: Response): Promise<void> => {
	const id = uuidv4();
	const portfolioId = req.params.portfolioId;
	const body = { ...req.body, id, portfolioId };

	try {
		const portfolio = await Portfolio.findOne({ where: { id: portfolioId }});
		if (!portfolio) {
			return badRequest(res, "No portfolio found: " + portfolioId);
		}
		const transaction = await PortfolioTransaction.create(body);
		portfolio.addTransactions(transaction.id);
		await modifyHoldings(portfolio, transaction);
		// transaction.setCurrency(currencyId);
		return success(res, transaction.toJSON());
	} catch (e) {
		console.error("Error creating transction, cause:", e);
		return serverError(res);
	}
};

export const getTransactionsHandler = async (req: Request, res: Response): Promise<void> => {
	const portfolioId = req.params.portfolioId;
	try {
		const portfolio = await Portfolio.findOne({ where: { id: portfolioId }});
		if (!portfolio) {
			return badRequest(res, "No portfolio found: " + portfolioId);
		}
		const transactions = await portfolio.getTransactions();
		return success(res, transactions);
	} catch (e) {
		console.error("Error getting transctions, cause:", e);
		return serverError(res);
	}
};

export const getPortfolioHoldings = async (req: Request, res: Response): Promise<void> => {
	const portfolioId = req.params.portfolioId;
	try {
		const portfolio = await Portfolio.findOne({ where: { id: portfolioId }});
		if (!portfolio) {
			return badRequest(res, "No portfolio found: " + portfolioId);
		}
		const holdings = await portfolio.getHoldings();
		return success(res, holdings);
	} catch (e) {
		console.error("Error getting transctions, cause:", e);
		return serverError(res);
	}
};