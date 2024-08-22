import { IUserData } from '../types';
import { IEvents } from './base/events';

export class UserData {
	private data: IUserData = {};

	updateData(newData: Partial<IUserData>) {
		this.data = { ...this.data, ...newData };
	}

	getData(): IUserData {
		return this.data;
	}
}
