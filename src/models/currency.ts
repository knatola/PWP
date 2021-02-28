import { Model, Sequelize } from "sequelize-typescript";
import { DataTypes, HasOneCreateAssociationMixin, HasOneGetAssociationMixin, HasOneSetAssociationMixin, Optional } from "sequelize";
import { IMarketData, MarketData } from "./market-data";

interface CurrencyImage {
    thumb: string;
    small: string;
    large: string;
}

export interface ICurrency {
    id: string;
    symbol: string;
    name: string;
    assetPlatformId: string;
    blockTimeInMinutes?: number | null;
    hashingAlgorithm: string;
    categories: string[];
    publicNotice: string | null;
    description: string;
    image: CurrencyImage;
    countryOrigin: string;
    genesisDate: string;
    sentimentVotesUpPercentage: number;
    marketCapRank: number;
    coingeckoRank: number;
    coingeckoScore: number;
    developerScore: number;
    communityScore: number;
    liquidityScore: number;
    publicInterestScore: number;
    updatedAt?: Date;
    createdAt?: Date;
}

type CurrencyCreationAttributes = Optional<ICurrency, "id">

export class Currency extends Model<Currency, CurrencyCreationAttributes> implements ICurrency {
    public id!: string;
    public symbol!: string;
    public name!: string;
    public assetPlatformId!: string;
    public blockTimeInMinutes: number;
    public hashingAlgorithm!: string;
    public categories!: string[];
    public publicNotice!: string | null;
    public description!: string;
    public image!: CurrencyImage;
    public genesisDate!: string;
    public countryOrigin!: string;
    public sentimentVotesUpPercentage!: number;
    public marketCapRank!: number;
    public coingeckoRank!: number;
    public coingeckoScore!: number;
    public developerScore!: number;
    public communityScore!: number;
    public liquidityScore!: number;
    public publicInterestScore!: number;
    public createdAt!: Date;
    public updatedAt!: Date;

    public getMarketData!: HasOneGetAssociationMixin<MarketData>;
    public setMarketData!: HasOneSetAssociationMixin<IMarketData, string>;
    public createMarketData!: HasOneCreateAssociationMixin<IMarketData>;
}


export const initCurrency = (sequelize: Sequelize): void => {
	Currency.init({
		id: {
			type: new DataTypes.STRING(128),
			primaryKey: true,
		},
		symbol: {
			type: DataTypes.STRING
		},
		name: {
			type: DataTypes.TEXT
		},
		assetPlatformId: {
			type: DataTypes.TEXT
		},
		blockTimeInMinutes: {
			type: DataTypes.INTEGER
		},
		hashingAlgorithm: {
			type: DataTypes.TEXT
		},
		publicNotice: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		description: {
			type: DataTypes.TEXT
		},
		categories: {
			type: DataTypes.ARRAY(DataTypes.TEXT)
		},
		image: {
			type: DataTypes.JSON
		},
		genesisDate: {
			type: DataTypes.STRING(128)
		},
		countryOrigin: {
			type: DataTypes.STRING(128)
		},
		sentimentVotesUpPercentage: {
			type: DataTypes.DOUBLE
		},
		marketCapRank: {
			type: DataTypes.INTEGER
		},
		coingeckoRank: {
			type: DataTypes.INTEGER
		},
		coingeckoScore: {
			type: DataTypes.DOUBLE
		},
		developerScore: {
			type: DataTypes.DOUBLE
		},
		communityScore: {
			type: DataTypes.DOUBLE
		},
		liquidityScore: {
			type: DataTypes.DOUBLE
		},
		publicInterestScore: {
			type: DataTypes.DOUBLE
		},
		updatedAt: {
			type: DataTypes.DATE
		},
		createdAt: {
			type: DataTypes.DATE
		}
	}, {
		sequelize,
		tableName: "currency"
	});
};