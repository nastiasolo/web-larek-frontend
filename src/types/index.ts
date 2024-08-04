export interface IItem {
	id: string;
	title: string;
	description: string;
	price: number | null;
	category: string;
	image: string;
}

export interface IUSer {
	payment: 'cash' | 'card';
	address: string;
	email: string;
	phone: string;
}

export interface IBasket {
	items: [IItem];
	total: number;
	getTotal(items: [IItem]): number;
	add(id: string): void;
	remove(id: string): void;
	checkItem(id: string): boolean;
}
