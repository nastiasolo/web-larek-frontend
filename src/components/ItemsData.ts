import { IItem, IItemData } from '../types';
import { IEvents } from './base/events';

export class ItemData implements IItemData {
	protected _itemsResponse: { total: number; items: IItem[] };
	protected _preview: string | null;
	protected events: IEvents;

	constructor(events: IEvents) {
		this.events = events;
	}

	// set items(items: IItem[]) {
	// 	this._items = items;
	// 	this.events.emit('items:changed');
	// }

	set itemsResponse(response: { total: number; items: IItem[] }) {
		// this._items = response.items;
		// this._total = response.total;
		this._itemsResponse = response;
		this.events.emit('items:changed');
	}

	get items(): IItem[] {
		return this._itemsResponse.items;
	}

	getItem(itemId: string) {
		return this.items.find((item) => item.id === itemId);
	}

	//метод, который возвращает карточку для превью
	get preview() {
		return this._preview;
	}
}
