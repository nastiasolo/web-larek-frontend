import { IUser, IUserData } from '../types';
import { IEvents } from './base/events';

export class UserData implements IUserData {
	protected payment: string;
	protected address: string;
	protected email: string;
	protected phone: string;
	protected events: IEvents;
	protected total: number;
	protected items: [string];

	constructor(events: IEvents) {
		this.events = events;
	}

	getUserInfo(): IUser {
		return {
			payment: this.payment,
			address: this.address,
			email: this.email,
			phone: this.phone,
		};
	}

	setUserInfo(userData: IUser): void {
		this.payment = userData.payment;
		this.address = userData.address;
		this.email = userData.email;
		this.phone = userData.phone;
	}

	//add validation
}
