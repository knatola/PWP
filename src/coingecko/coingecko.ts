import CoinGecko from "coingecko-api";
import { Config } from "../config/app-config";
import { Currency, ICurrency } from "../models/currency";
import { IMarketData } from "../models/market-data";

const coinGeckoClient = new CoinGecko();
const ids: CurrencyNameData[] = [];

type CurrencyNameData = {
	id: string;
	symbol: string;
	name: string;
}

export type CurrencyWithMarketData = {
	currency: ICurrency,
	marketData: IMarketData
}

export async function fetchCurrencyData(currencyId: string): Promise<CurrencyWithMarketData | null> {
	try {
		const res = await coinGeckoClient.coins.fetch(currencyId, { localization: false });
		if (res.success) {
			const data = res.data;
			const marketDataJson = data.market_data;
			const marketData = mapMarketData(marketDataJson, currencyId);
			const currency = mapCurrencyData(data);
			return {
				currency,
				marketData
			};
		} else {
			console.log("failed fetch with status:", res.code, ", message:", res.message);
			console.log("Sleeping for 5 seconds and retrying");
			await new Promise(r => setTimeout(r, 5000));
			return await fetchCurrencyData(currencyId);
		}
	} catch (e) {
		console.error("failed fetch of:", currencyId, "status: ", e);
		console.log("Sleeping for 5 seconds and retrying");
		await new Promise(r => setTimeout(r, 5000));
		return await fetchCurrencyData(currencyId);
	}
}

export async function fetchIds(): Promise<CurrencyNameData[]> {
	const res = await coinGeckoClient.coins.list();
	if (res.success) {
		const data = res.data;
		ids.push(...data);
		return ids;
	} else {
		return [];
	}
}

const fetchCurrenciesFromCoingecko = async (page: number): Promise<string[]> => {
	const res = await coinGeckoClient.coins.all({ per_page: 50, page, localization: true });
	if (res.success) {
		return res.data.map(json => json.id);
	} else {
		console.warn("Failed to fetch data from coingecko, status:", res.statusCode,);
		console.log("Sleeping for 1 second and retrying");
		await new Promise(r => setTimeout(r, 1000));
		return await fetchCurrenciesFromCoingecko(page);
	}
};

export function createDataBasePopulator(
	fetchData: (currencyId: string) => Promise<CurrencyWithMarketData | null>,
	persistData: (data: CurrencyWithMarketData) => void,
	config: Config): () => Promise<string[]> {
	return async () => {
		const maxPage = config.dev ? 5 : 500;
		let page = 1;
		while (page < maxPage) {
			const data = await fetchCurrenciesFromCoingecko(page);
			console.log(data.length);
			for (const id of data) {
				const currencyWithMarketData = await fetchData(id);
				persistData(currencyWithMarketData);
				await new Promise(r => setTimeout(r, 900));
			}
			console.log(`page: ${page} updated, waiting 2 seconds before fetching next page`);
			await new Promise(r => setTimeout(r, 2000));
			page++;
		}
		return [];
	};
}

export function createDataBaseUpdater(
	fetchData: (currencyId: string) => Promise<CurrencyWithMarketData | null>,
	getCurrencies: () => Promise<Currency[]>,
	persistData: (data: CurrencyWithMarketData) => void): () => void {
	return async () => {
		const currencies = await getCurrencies();
		for (const currency of currencies) {
			const currencyWithMarketData = await fetchData(currency.id);
			persistData(currencyWithMarketData);
			// This timeout is just to avoid hitting coingecko api limit
			await new Promise(r => setTimeout(r, 900));
		}
	};
}

function mapCurrencyData(data: any): ICurrency {
	return {
		id: data.id,
		symbol: data.symbol,
		name: data.name,
		assetPlatformId: data.asset_platform_id,
		hashingAlgorithm: data.hashing_algorithm,
		blockTimeInMinutes: data.block_time_in_minutes,
		// The category needs some prettifying so that the querying from db + api will be a bit user friendly
		categories: data.categories.map((c: string) => {
			const cleanedString = c.toLowerCase().split("(")[0].trim().replace(/ /g, "-").replace("-/-", "/");
			return cleanedString;
		}),
		publicNotice: data.public_notice,
		description: data.description.en,
		image: data.image,
		countryOrigin: data.country_origin,
		genesisDate: data.genesis_date,
		sentimentVotesUpPercentage: data.sentiment_votes_up_percentage,
		marketCapRank: data.market_cap_rank,
		coingeckoRank: data.coingecko_rank,
		coingeckoScore: data.coingecko_score,
		developerScore: data.developer_score,
		communityScore: data.community_score,
		liquidityScore: data.liquidity_score,
		publicInterestScore: data.public_interest_score,
	};
}

function mapMarketData(json: any, id: string): IMarketData {
	return {
		marketDataId: id,
		currentPrice: json.current_price,
		ath: json.ath,
		atl: json.atl,
		athChangePercentage: json.ath_change_percentage,
		atlChangePercentage: json.atl_change_percentage,
		atlDate: json.atl_date,
		athDate: json.ath_date,
		marketCap: json.market_cap,
		fullyDilutedValuation: json.fully_diluted_valuation,
		totalVolume: json.total_volume,
		high24h: json.high_24h,
		low24h: json.low_24h,
		priceChange24hInCurrency: json.price_change_24h_in_currency,
		priceChangePercentage1hInCurrency: json.price_change_percentage_1h_in_currency,
		priceChangePercentage24hInCurrency: json.price_change_percentage_24h_in_currency,
		priceChangePercentage7dInCurrency: json.price_change_percentage_7d_in_currency,
		priceChangePercentage14dInCurrency: json.price_change_percentage_14d_in_currency,
		priceChangePercentage30dInCurrency: json.price_change_percentage_30d_in_currency,
		priceChangePercentage60dInCurrency: json.price_change_percentage_60d_in_currency,
		priceChangePercentage200dInCurrency: json.price_change_percentage_200d_in_currency,
		priceChangePercentage1yInCurrency: json.price_change_percentage_1y_in_currency,
		marketCapChangePercentage24hInCurrency: json.market_cap_change_percentage_24h_in_currency,
		marketCapRank: json.market_cap_rank,
		priceChange24h: json.price_change_24h,
		marketCapChange24h: json.market_cap_change_24h,
		marketCapChangePercentage24h: json.market_cap_change_percentage_24h,
		priceChangePercentage24h: json.price_change_percentage_24h,
		priceChangePercentage7d: json.price_change_percentage_7d,
		priceChangePercentage14d: json.price_change_percentage_14d,
		priceChangePercentage30d: json.price_change_percentage_30d,
		priceChangePercentage60d: json.price_change_percentage_60d,
		priceChangePercentage200d: json.price_change_percentage_200d,
		priceChangePercentage1y: json.price_change_percentage_1y,
		totalSupply: json.total_supply,
		maxSupply: json.max_supply,
		circulatingSupply: json.circulating_supply,
		lastUpdated: json.last_updated,
	};
}
