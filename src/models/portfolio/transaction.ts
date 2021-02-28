import { Model, Sequelize } from "sequelize-typescript";
import { DataTypes, HasOneCreateAssociationMixin, HasOneGetAssociationMixin, HasOneSetAssociationMixin, Optional } from "sequelize";
import { Currency } from "../currency";

export enum TransactionType {
	SELL,
	BUY
}

export interface IPortfolioTransaction {
    id: string;
    amount: number;
	type: TransactionType;
    price: number;
    currency: string;
	portfolioId: string;
	// Currency received in sell, currency bought with in buy
	targetCurrency: string;
    updatedAt?: Date;
    createdAt?: Date;
}

type PortfolioCreationAttributes = Optional<IPortfolioTransaction, "id">;

export class PortfolioTransaction extends Model<PortfolioTransaction, PortfolioCreationAttributes> implements IPortfolioTransaction {
    public id!: string;
    public type!: TransactionType;
    public amount!: number;
    public price!: number;
    public targetCurrency: string;
    public currency!: string;
	public portfolioId!: string;
    public createdAt!: Date;
    public updatedAt!: Date;

    public getCurrency!: HasOneGetAssociationMixin<Currency>;
    public setCurrency!: HasOneSetAssociationMixin<Currency, string>;
    public createCurrency!: HasOneCreateAssociationMixin<Currency>;
}

export const initPortfolioTransaction = (sequelize: Sequelize): void => {
	const transactionTypes = ["sell", "buy"];
	PortfolioTransaction.init({
		id: {
			type: new DataTypes.STRING(128),
			primaryKey: true,
		},
		amount: {
			type: DataTypes.DOUBLE
		},
		price: {
			type: DataTypes.DOUBLE
		},
		portfolioId: {
			type: new DataTypes.STRING(128)
		},
		targetCurrency: {
			type: new DataTypes.STRING(128)
		},
		currency: {
			type: new DataTypes.STRING(128)
		},
		updatedAt: {
			type: DataTypes.DATE
		},
		createdAt: {
			type: DataTypes.DATE
		},
		type: {
			type: DataTypes.ENUM,
			values: transactionTypes,
			allowNull: false
		}
	}, {
		sequelize,
		tableName: "portfolio_transaction"
	});
};