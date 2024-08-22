import { IApi, IItem, IOrderResult, IUserData } from '../types';
import { UserData } from './UserData';

export class AppApi {
	private _baseApi: IApi;

	constructor(baseApi: IApi) {
		this._baseApi = baseApi;
	}

	getItems(): Promise<{ total: number; items: IItem[] }> {
		return this._baseApi.get<{ total: number; items: IItem[] }>('/product');
		// .then((items: IItem[]) => items);
	}

	setOrder(order: IUserData): Promise<IOrderResult> {
		return this._baseApi
			.post<IUserData>(`/order`, order)
			.then((data: IOrderResult) => data)
			.catch((error: any) => {
				console.error('Order submission failed:', error);
				throw error;
			});
	}
}
