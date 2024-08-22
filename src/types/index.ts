export interface IItem {
	id: string;
	title: string;
	description: string;
	price: number | null;
	category: string;
	image: string;
}

export interface IBasketData {
	items: [IItem];
	total: number;
	getTotal(items: [IItem]): number;
	add(id: string): void;
	remove(id: string): void;
	checkItem(id: string): boolean;
}

export interface IItemData {
	items: IItem[];
	preview: string | null;
	getItem(itemId: string): IItem;
}

export interface IUserData {
	payment?: string;
	email?: string;
	phone?: string;
	address?: string;
	total?: number;
	items?: string[];
}

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
	baseUrl: string;
	get<T>(uri: string): Promise<T>;
	post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}

export interface IOrderResult {
	id?: string;
	total?: number;
	error?: string;
}
