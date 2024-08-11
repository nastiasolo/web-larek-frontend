import { IApi, IItem, IUser } from '../types';

export class AppApi {
	private _baseApi: IApi;

	constructor(baseApi: IApi) {
		this._baseApi = baseApi;
	}

	getItems(): Promise<{ total: number; items: IItem[] }> {
		return this._baseApi.get<{ total: number; items: IItem[] }>('/product');
		// .then((items: IItem[]) => items);
	}

	// getUser(): Promise<IUser> {
	// 	return this._baseApi.get<IUser>('/users/me').then((user: IUser) => user);
	// }
}
