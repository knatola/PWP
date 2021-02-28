import { CurrencyWithMarketData } from "../coingecko/coingecko";
import { Op } from "sequelize";
import { Currency, ICurrency } from "../models/currency";
import { MarketData } from "../models/market-data";

export const createCurrency = async (currency: CurrencyWithMarketData): Promise<string | null> => {
	try {
		const createdCurrency = await Currency.create(currency.currency);
		await createdCurrency.createMarketData(currency.marketData as any);
		return currency.currency.id;
	} catch (e) {
		console.warn("Failed to create currency:", currency.currency.id, "cause:", e);
		return null;
	}
};

export const updateMarketData = async (currency: CurrencyWithMarketData): Promise<string | null> => {
	try {
		const marketData = currency.marketData;
		await MarketData.update(marketData, { where: { marketDataId: currency.currency.id } });
		return currency.currency.id;
	} catch (e) {
		console.warn("Failed to create currency:", currency.currency.id, "cause:", e);
		return null;
	}
};

export const getCurrency = async (id: string): Promise<ICurrency> => {
	const data = await Currency.findOne({ where: { id } });
	console.log("found from db :", data);
	return data;
};

export const getCurrenciesByUpdatedAt = async (): Promise<Currency[]> => {
	const data = await Currency.findAll({
		order: [["updatedAt", "asc"]],
		limit: 20,
	});

	return data;
};

export const findCurrencies = async (sort: string, order: "asc" | "desc", offset: number, limit: number, categories: string[]): Promise<Currency[]> => {
	const orderArr = createSortArray(sort, order);
	console.log("sort: ", sort);
	console.log("order arr: ", orderArr);
	const where = createWhereObj(categories);
	const currencies = await Currency.findAll({
		where,
		order: orderArr,
		limit,
		offset,
		include: [Currency.associations.marketData]
	});

	return currencies;
};

function createWhereObj(categories: string[]): any {
	if (!categories || categories.length === 0) {
		return {};
	}
	return {
		categories: {
			[Op.contains]: categories
		}
	};
}

function createSortArray(sort: string, order: "asc" | "desc"): any {
	switch (sort) {
	case "priceChange24h": {
		return [["marketData", "priceChange24h", order.toUpperCase()]];
	}
	case "priceChangePercentage24h": {
		return [["marketData", "priceChangePercentage24h", order.toUpperCase()]];
	}
	case "priceChangePercentage7d": {
		return [["marketData", "priceChangePercentage7d", order.toUpperCase()]];
	}
	case "priceChangePercentage14d": {
		return [["marketData", "priceChangePercentage14d", order.toUpperCase()]];
	}
	case "priceChangePercentage30d": {
		return [["marketData", "priceChangePercentage30d", order.toUpperCase()]];
	}
	case "priceChangePercentage60d": {
		return [["marketData", "priceChangePercentage60d", order.toUpperCase()]];
	}
	case "priceChangePercentage1y": {
		return [["marketData", "priceChangePercentage1y", order.toUpperCase()]];
	}
	case "marketCapRank":
	default: {
		return [
			["marketCapRank", order.toUpperCase()],
		];
	}
	}
}