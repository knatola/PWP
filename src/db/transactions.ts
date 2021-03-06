import { v4 as uuidv4 } from "uuid";
import { Holding, IHolding } from "../models/portfolio/holding";
import { Portfolio } from "../models/portfolio/portfolio";
import { PortfolioTransaction, TransactionType } from "../models/portfolio/transaction";
import { InsufficientAmountError } from "./errors";

export const modifyHoldings = async (portfolio: Portfolio, transaction: PortfolioTransaction): Promise<IHolding[]> => {
	const holdings = await portfolio.getHoldings();
	if (!holdings || holdings.length < 1) {
		// No existing holdings list -> create new holding and list
		const newHolding = await createNewHolding(portfolio, transaction);
		return [newHolding];
	} else if (holdings.some(h => h.coinId === transaction.targetCurrency)) {
		// Holdings list exist and a holdingw with this coin id -> update holding
		const newHolding = await modifyExistingHolding(portfolio, holdings, transaction);
		const filtered = holdings.filter(h => h.id !== newHolding.id);
		return [...filtered, newHolding];
	} else {
		// Holdings list exist, but no holding for this coin id -> create new holding
		const newHolding = await createNewHolding(portfolio, transaction);
		return [...holdings, newHolding];
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

async function modifyExistingHolding(portfolio: Portfolio, holdings: IHolding[], transaction: PortfolioTransaction): Promise<IHolding | null> {
	const holding = await Holding.findOne({ where: { coinId: transaction.targetCurrency, portfolioId: portfolio.id } });
	if (!holdings) {
		// Failed to find holding
		return null;
	}

	const isBuy = transaction.type === TransactionType.BUY;
	if (isBuy) {
		holding.amount = holding.amount + transaction.amount;
	} else {
		if (holding.amount - transaction.amount < 0) {
			throw new InsufficientAmountError("Not enough ");
		}

		holding.amount = holding.amount - transaction.amount;
	}
	holding.save();
	return holding;
}