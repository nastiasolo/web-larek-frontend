import { IUserData } from '../types';

export class UserData {
	private data: IUserData = {};

	updateData(newData: Partial<IUserData>) {
		this.data = { ...this.data, ...newData };
	}

	getData(): IUserData {
		return this.data;
	}
}
