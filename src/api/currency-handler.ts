import { Request, Response } from "express";
import { Currency } from "../models/currency";
import { Op } from "sequelize";
import { badRequest, notFound, parseIntFallback, serverError, success } from "./util";
import { findCurrencies } from "../db/currency-persistance";

const sortTypes = ["marketCapRank", "priceChange24h", "priceChangePercentage7d",
	"priceChangePercentage30d", "priceChangePercentage24h", "priceChangePercentage60d",
	"priceChangePercentage1y"
];

export const currencyHandler = async (req: Request, res: Response): Promise<void> => {
	const id = req.params.currencyId;
	const currency = await Currency.findOne({ where: { id } });
	const marketData = await currency.getMarketData();

	if (currency) {
		return success(res, { currency, marketData });
	} else {
		return notFound(res);
	}
};

export const currencyHandlerAll = async (req: Request, res: Response): Promise<void> => {
	const params = req.query;
	let limit = 20;
	let page = 0;
	let order: "asc" | "desc" = "asc";
	let sort = "marketCap";
	const categories: string[] = [];

	if (params) {
		if (params.sort && sortTypes.some(i => i === params.sort)) {
			sort = params.sort as string;
		}
		if (params.category) {
			categories.push(...(params.category as string).split(",").map(s => s.trim()));
		}
		order = params.order ? params.order as "asc" | "desc" : order;
		if (order !== "asc" && order !== "desc") {
			return badRequest(res);
		}
		page = parseIntFallback(params.page as string, page);
		limit = parseIntFallback(params.limit as string, limit);
	}

	const offset = limit * page;
	if (offset < 0) {
		return badRequest(res);
	}

	try {
		const currencies = await findCurrencies(sort, order, offset, limit, categories);

		if (currencies) {
			return success(res, { page, size: currencies.length, currencies });
		} else {
			return notFound(res);
		}
	} catch (e) {
		console.error("failed to find currencies, cause:", e);
		return serverError(res);
	}
};

export const search = async (req: Request, res: Response): Promise<void> => {
	const q = req.query;
	if (!q && !(q.query)) {
		return badRequest(res);
	}

	const query = q.query as string;

	try {
		const currencies = await Currency.findAll({
			where: {
				[Op.or]: [
					{
						name: { [Op.iLike]: `%${query}%` }
					},
					{
						symbol: { [Op.iLike]: `%${query}%` }
					}
				]
			}
		});

		return success(res, currencies);
	} catch (e) {
		console.error("Failed in doing query", e);
		return serverError(res);
	}

};

export const categoriesHandler = async (req: Request, res: Response): Promise<void> => {
	try {
		const categories = await Currency.findAll({ attributes: ["categories"] });
		const mapped = categories.map((c) => c.categories).reduceRight((acc, val) => acc.concat(val), []);
		return success(res, [...new Set(mapped)]);
	} catch (e) {
		console.error("Error getting categories:", e);
		return serverError(res);
	}
};