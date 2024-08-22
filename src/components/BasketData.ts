import { IItem } from '../types';
import { IEvents } from './base/events';

export class BasketData {
	private items: IItem[] = []; // Массив товаров в корзине
	private events: IEvents;

	constructor(events: IEvents) {
		this.events = events;
		//подписка на событие добавления товара в корзину (по кнопке "в корзину")
		this.events.on('basket:add-item', this.addItem.bind(this));
		this.events.on('basket:remove-item', this.removeItem.bind(this));
	}

	// Метод для добавления товара в корзину
	addItem(item: IItem): void {
		if (!this.isItemInBasket(item.id)) {
			this.items.push(item);
			this.updateBasket();
		}
	}

	// Метод для проверки, находится ли товар в корзине
	isItemInBasket(itemId: string): boolean {
		return this.items.some((item) => item.id === itemId);
	}

	// Метод для удаления товара из корзины по его ID
	removeItem(itemId: string): void {
		this.items = this.items.filter((item) => item.id !== itemId);
		this.updateBasket();
	}

	getItems(): IItem[] {
		return this.items;
	}

	// Метод для получения общего количества товаров
	getTotalItems(): number {
		return this.items.length;
	}

	// Метод для получения общей суммы корзины
	getTotalPrice(): number {
		return this.items.reduce((total, item) => total + (item.price || 0), 0);
	}

	// Метод для очистки корзины
	clearBasket(): void {
		this.items = [];
		this.updateBasket();
	}

	// Обновление корзины
	private updateBasket(): void {
		this.events.emit('basket:update', {
			items: this.getItems(),
			totalPrice: this.getTotalPrice(),
		});
	}
}
