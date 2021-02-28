import { v4 as uuidv4 } from "uuid";
import { Holding, IHolding } from "../models/portfolio/holding";
import { Portfolio } from "../models/portfolio/portfolio";
import { PortfolioTransaction } from "../models/portfolio/transaction";

export const modifyHoldings = async (portfolio: Portfolio, transaction: PortfolioTransaction): Promise<IHolding[]> => {
	const holdings = await portfolio.getHoldings();
	if (holdings || holdings.length < 1) {
		const newHolding = await createNewHolding(portfolio, transaction);
		return [newHolding];
	}
};

async function createNewHolding(portfolio: Portfolio, transaction: PortfolioTransaction): Promise<Holding> {
	const newHolding = {
		id: uuidv4(),
		amount: transaction.amount,
		coinId: transaction.currency,
		portfolioId: portfolio.id
	};
	const holding = await Holding.create(newHolding);
	return holding;
}