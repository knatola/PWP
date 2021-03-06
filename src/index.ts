import { Sequelize } from "sequelize-typescript";
import { createDataBasePopulator, createDataBaseUpdater, fetchCurrencyData } from "./coingecko/coingecko";
import express from "express";
import dbConfig from "./config/db-config";
import config from "./config/app-config";
import createSequelize from "./config/create-sequelize";
import { body, validationResult } from "express-validator";
import { categoriesHandler, currencyHandler, currencyHandlerAll, search } from "./api/currency-handler";
import { createPortfolioHandler, createTransactionHandler, createTransactionUpdateHandler, getPortfolioHoldings, getTransactionsHandler } from "./api/portfolio-handler";
import { getCurrenciesByUpdatedAt, createCurrency, updateMarketData } from "./db/currency-persistance";

(async () => {
	const sequelize: Sequelize = createSequelize(dbConfig);
	try {
		await sequelize.authenticate();
		await sequelize.sync({ force: true });
		const app = express();
		const port = 8000;
		app.use(express.json());
		app.listen(port, () => {
			console.log("server started at port:", port);
		});

		bindHandlers(app);

		const populateDb = createDataBasePopulator(fetchCurrencyData, createCurrency, config);
		const updateDb = createDataBaseUpdater(fetchCurrencyData, getCurrenciesByUpdatedAt, updateMarketData);
		await populateDb();

		// Every 5 seconds, attempt to update database
		setInterval(() => {
			updateDb();
		}, 5000);
	} catch (error) {
		console.error("Error:", error);
	}
})();


function bindHandlers(app: any) {
	app.get("/currency/search", search);
	app.get("/currency/:currencyId", currencyHandler);
	app.get("/currency", currencyHandlerAll);
	app.get("/categories", categoriesHandler);
	app.post("/portfolios",
		createPortfolioHandler);
	app.post("/portfolios/:portfolioId/transactions",
		body("amount").isFloat(),
		body("type")
			.notEmpty()
			.custom((type) => type === "sell" || type === " buy"),
		body("price").isNumeric(),
		body("currency").isString(),
		createTransactionHandler);
	app.put("/portfolios/:portfolioId/transactions/:transactionId",
		body("amount").optional().isFloat(),
		body("type")
			.optional()
			.notEmpty()
			.custom((type) => type === "sell" || type === " buy"),
		body("price").optional().isNumeric(),
		body("currency").optional().isString(),
		createTransactionUpdateHandler);
	app.get("/portfolios/:portfolioId/transactions",
		getTransactionsHandler);
	app.get("/portfolios/:portfolioId/holdings",
		getPortfolioHoldings);
}
