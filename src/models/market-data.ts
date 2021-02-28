import { Model, Sequelize } from "sequelize-typescript";
import { DataTypes } from "sequelize";

interface PriceMap {
    [currency: string]: number;
}

interface DateMap {
    [currency: string]: string;
}

export interface IMarketData {
    marketDataId: string;
    currentPrice: PriceMap;
    ath: PriceMap;
    atl: PriceMap;
    athChangePercentage: PriceMap;
    atlChangePercentage: PriceMap;
    athDate: DateMap;
    atlDate: DateMap;
    marketCap: PriceMap;
    fullyDilutedValuation: PriceMap;
    totalVolume: PriceMap;
    high24h: PriceMap;
    low24h: PriceMap;
    priceChange24hInCurrency: PriceMap;
    priceChangePercentage1hInCurrency: PriceMap;
    priceChangePercentage24hInCurrency: PriceMap;
    priceChangePercentage7dInCurrency: PriceMap;
    priceChangePercentage14dInCurrency: PriceMap;
    priceChangePercentage30dInCurrency: PriceMap;
    priceChangePercentage60dInCurrency: PriceMap;
    priceChangePercentage200dInCurrency: PriceMap;
    priceChangePercentage1yInCurrency: PriceMap;
    marketCapChangePercentage24hInCurrency: PriceMap;
    marketCapRank: number;
    priceChange24h: number;
    marketCapChange24h: number;
    marketCapChangePercentage24h: number;
    priceChangePercentage24h: number;
    priceChangePercentage7d: number;
    priceChangePercentage14d: number;
    priceChangePercentage30d: number;
    priceChangePercentage60d: number;
    priceChangePercentage200d: number;
    priceChangePercentage1y: number;
    totalSupply: number;
    maxSupply: number;
    circulatingSupply: number;
    lastUpdated: string;
}

// interface ImarketDataCreationAttributes extends Optional<IMarketData, optional> {}

export class MarketData extends Model<MarketData, IMarketData> implements IMarketData{
    marketDataId!: string;
    currentPrice!: PriceMap;
    ath!: PriceMap;
    atl!: PriceMap;
    athChangePercentage!: PriceMap;
    atlChangePercentage!: PriceMap;
    athDate!: DateMap;
    atlDate!: DateMap;
    marketCap!: PriceMap;
    fullyDilutedValuation!: PriceMap;
    totalVolume!: PriceMap;
    high24h!: PriceMap;
    low24h!: PriceMap;
    priceChange24hInCurrency!: PriceMap;
    priceChangePercentage1hInCurrency!: PriceMap;
    priceChangePercentage24hInCurrency!: PriceMap;
    priceChangePercentage7dInCurrency!: PriceMap;
    priceChangePercentage14dInCurrency!: PriceMap;
    priceChangePercentage30dInCurrency!: PriceMap;
    priceChangePercentage60dInCurrency!: PriceMap;
    priceChangePercentage200dInCurrency!: PriceMap;
    priceChangePercentage1yInCurrency!: PriceMap;
    marketCapChangePercentage24hInCurrency!: PriceMap;
    marketCapRank!: number;
    priceChange24h!: number;
    marketCapChange24h!: number;
    marketCapChangePercentage24h!: number;
    priceChangePercentage24h!: number;
    priceChangePercentage7d!: number;
    priceChangePercentage14d!: number;
    priceChangePercentage30d!: number;
    priceChangePercentage60d!: number;
    priceChangePercentage200d!: number;
    priceChangePercentage1y!: number;
    totalSupply!: number;
    maxSupply!: number;
    circulatingSupply!: number;
    lastUpdated!: string;
}

export const initMarketData = (sequelize: Sequelize): void => {
	MarketData.init({
		marketDataId: {
			type:  DataTypes.STRING(128),
			primaryKey: true
		},
		currentPrice: {
			type: DataTypes.JSON
		},
		ath: {
			type: DataTypes.JSON
		},
		atl: {
			type: DataTypes.JSON
		},
		athChangePercentage: {
			type: DataTypes.JSON
		},
		atlChangePercentage: {
			type: DataTypes.JSON
		},
		athDate: {
			type: DataTypes.JSON
		},
		atlDate: {
			type: DataTypes.JSON
		},
		marketCap: {
			type: DataTypes.JSON
		},
		fullyDilutedValuation: {
			type: DataTypes.JSON
		},
		totalVolume: {
			type: DataTypes.JSON
		},
		high24h: {
			type: DataTypes.JSON
		},
		low24h: {
			type: DataTypes.JSON
		},
		priceChange24hInCurrency: {
			type: DataTypes.JSON
		},
		priceChangePercentage1hInCurrency: {
			type: DataTypes.JSON
		},
		priceChangePercentage24hInCurrency: {
			type: DataTypes.JSON
		},
		priceChangePercentage7dInCurrency: {
			type: DataTypes.JSON
		},
		priceChangePercentage14dInCurrency: {
			type: DataTypes.JSON
		},
		priceChangePercentage30dInCurrency: {
			type: DataTypes.JSON
		},
		priceChangePercentage60dInCurrency: {
			type: DataTypes.JSON
		},
		priceChangePercentage200dInCurrency: {
			type: DataTypes.JSON
		},
		priceChangePercentage1yInCurrency: {
			type: DataTypes.JSON
		},
		marketCapChangePercentage24hInCurrency: {
			type: DataTypes.JSON
		},
		marketCapRank: {
			type: DataTypes.INTEGER
		},
		priceChange24h: {
			type: DataTypes.DOUBLE
		},
		marketCapChange24h: {
			type: DataTypes.DOUBLE
		},
		priceChangePercentage24h: {
			type: DataTypes.DOUBLE
		},
		priceChangePercentage7d: {
			type: DataTypes.DOUBLE
		},
		priceChangePercentage14d: {
			type: DataTypes.DOUBLE
		},
		priceChangePercentage30d: {
			type: DataTypes.DOUBLE
		},
		priceChangePercentage60d: {
			type: DataTypes.DOUBLE
		},
		priceChangePercentage200d: {
			type: DataTypes.DOUBLE
		},
		priceChangePercentage1y: {
			type: DataTypes.DOUBLE
		},
		totalSupply: {
			type: DataTypes.DOUBLE
		},
		maxSupply: {
			type: DataTypes.DOUBLE
		},
		circulatingSupply: {
			type: DataTypes.DOUBLE
		},
		lastUpdated: {
			type: DataTypes.STRING
		}
	}, {
		sequelize,
		tableName: "market_data",
	});
};