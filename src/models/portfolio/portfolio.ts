import { Model, Sequelize } from "sequelize-typescript";
import { DataTypes, HasManyAddAssociationMixin, HasManyCreateAssociationMixin, HasManyGetAssociationsMixin, HasManySetAssociationsMixin, HasOneCreateAssociationMixin, HasOneGetAssociationMixin, HasOneSetAssociationMixin, Optional } from "sequelize";
import { Holding, IHolding } from "./holding";
import { IPortfolioTransaction } from "./transaction";

export interface IPortfolio {
    id: string;
    updatedAt?: Date;
    createdAt?: Date;
}

type PortfolioCreationAttributes = Optional<IPortfolio, "id">;

export class Portfolio extends Model<Portfolio, PortfolioCreationAttributes> implements IPortfolio {
    public id!: string;
	public updatedAt?: Date;
	public createdAt?: Date;

    public getHoldings!: HasManyGetAssociationsMixin<IHolding>;
    public setHoldings!: HasManySetAssociationsMixin<IHolding, string>;
    public createHolding!: HasManyCreateAssociationMixin<IHolding>;

    public getTransactions!: HasManyGetAssociationsMixin<IPortfolioTransaction>;
    public setTransactions!: HasManySetAssociationsMixin<IPortfolioTransaction, string>;
    public addTransactions!: HasManyAddAssociationMixin<IPortfolioTransaction, string>;
    public createTransactions!: HasManyCreateAssociationMixin<IPortfolioTransaction>;
}

export const initPortfolio = (sequelize: Sequelize): void => {
	Portfolio.init({
		id: {
			type: new DataTypes.STRING(128),
			primaryKey: true,
		},
		updatedAt: {
			type: DataTypes.DATE
		},
		createdAt: {
			type: DataTypes.DATE
		}
	}, {
		sequelize,
		tableName: "portfolio"
	});
};

