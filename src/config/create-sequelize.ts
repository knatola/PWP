import { Sequelize } from "sequelize-typescript";
import { Dialect } from "sequelize/types";
import { Currency, initCurrency } from "../models/currency";
import { initMarketData, MarketData } from "../models/market-data";
import { Holding, initHolding } from "../models/portfolio/holding";
import { initPortfolio, Portfolio } from "../models/portfolio/portfolio";
import { initPortfolioTransaction, PortfolioTransaction } from "../models/portfolio/transaction";
import { DbConfig } from "./db-config";


export default (config: DbConfig): Sequelize => {
	const sequelize = new Sequelize({
		dialect: config.dialect as Dialect,
		database: config.database,
		port: config.port,
		password: config.password,
		username: config.username,
		logging: false,
		host: config.host
	});

	initCurrency(sequelize);
	initMarketData(sequelize);
	initHolding(sequelize);
	initPortfolio(sequelize);
	initPortfolioTransaction(sequelize);
	Currency.hasOne(MarketData, {
		sourceKey: "id",
		foreignKey: "currencyId",
		as: "marketData"
	});
	MarketData.belongsTo(Currency);
	Portfolio.hasMany(PortfolioTransaction, {
		sourceKey: "id",
		foreignKey: "portfolioId",
		as: "transactions"
	});
	// PortfolioTransaction.belongsTo(Portfolio,
	// 	{
	// 		sourceKey: "portfolioId",
	// 		foreignKey: "id",
	// 		as: ""
	// 	});
	Portfolio.hasMany(Holding, {
		sourceKey: "id",
		foreignKey: "portfolioId",
		as: "holdings"
	});

	return sequelize;
};