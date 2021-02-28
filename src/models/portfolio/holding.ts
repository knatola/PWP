import { Model, Sequelize } from "sequelize-typescript";
import { DataTypes, HasOneCreateAssociationMixin, HasOneGetAssociationMixin, HasOneSetAssociationMixin, Optional } from "sequelize";
import { Currency } from "../currency";


export interface IHolding {
    id: string;
    amount: number;
	coinId: string;
	portfolioId: string;
    updatedAt?: Date;
    createdAt?: Date;
}

type HoldingCreationAttributes = Optional<IHolding, "id">;

export class Holding extends Model<Holding, HoldingCreationAttributes> implements IHolding {
    public id!: string;
    public coinId!: string;
    public amount!: number;
	public portfolioId!: string;
    public updatedAt?: Date;
    public createdAt?: Date;

    public getCurrency!: HasOneGetAssociationMixin<Currency>;
    public setCurrency!: HasOneSetAssociationMixin<Currency, string>;
    public createCurrency!: HasOneCreateAssociationMixin<Currency>;
}

export const initHolding = (sequelize: Sequelize): void => {
	Holding.init({
		id: {
			type: new DataTypes.STRING(128),
			primaryKey: true,
		},
		coinId: {
			type: new DataTypes.STRING(128),
			primaryKey: true,
		},
		portfolioId: {
			type: new DataTypes.STRING(128),
			primaryKey: true,
		},
		amount: {
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
		tableName: "holding"
	});
};