import { IItem } from '../types';
// import { Item } from './Item';
// import { IEvents } from './base/events';
// import { Modal } from './common/Modal';
// import { cloneTemplate } from '../utils/utils';
// import { ensureElement } from '../utils/utils';

// import { createElement } from '../utils/utils';

export interface IModalWithBasket {
	items: IItem[];
	total: number;
}

// export class ModalWithBasket extends Modal<IModalWithBasket> {
// 	private _list: HTMLElement;
// 	private _total: HTMLElement;
// 	// private _button: HTMLButtonElement;

// 	constructor(container: HTMLElement, events: IEvents) {
// 		super(container, events);

// 		this._list = this.container.querySelector('.basket__list');
// 		this._total = this.container.querySelector('.basket__price');
// 		//	this._button = this.container.querySelector('.basket-confirm-button');

// 		// if (this._button) {
// 		// 	this._button.addEventListener('click', () => {
// 		// 		events.emit('form:open');
// 		// 	});
// 		// }

// 		super.items = [];
// 		this.total = 0;

// 		this.events.on(
// 			'basket:update',
// 			(data: { items: IItem[]; totalPrice: number }) => {
// 				this.items = data.items;
// 				this.total = data.totalPrice;
// 			}
// 		);
// 	}

// set items(items: IItem[]) {
// 	if (items.length) {
// 		this._list.replaceChildren(...items);
// 	} else {
// 		this._list.replaceChildren(
// 			createElement<HTMLParagraphElement>('p', {
// 				textContent: 'Корзина пуста',
// 			})
// 		);
// 	}
// 	// Пересчитываем сумму при каждом изменении списка товаров
// 	this.calculateTotal(items);
// }

// Сеттер для items с перерасчетом суммы
// set items(items: IItem[]) {
// 	this.items = items;
// 	this.renderItems(items);
// 	this.calculateTotal(items); // Пересчитываем сумму при каждом изменении списка товаров
// }

// private renderItems(items: IItem[]): void {
// 	const itemTemplate: HTMLTemplateElement =
// 		document.querySelector('#card-basket');
// 	if (items.length) {
// 		const itemElements = items.map((item, index) => {
// 			const itemInstant = new Item(cloneTemplate(itemTemplate), this.events);
// 			return itemInstant.render(item);
// 		});
// 		this._list.replaceChildren(...itemElements);
// 	} else {
// 		this._list.replaceChildren(
// 			createElement<HTMLParagraphElement>('p', {
// 				textContent: 'Корзина пуста',
// 			})
// 		);
// 	}
// }

// // Метод для вычисления общей суммы
// private calculateTotal(items: IItem[]): void {
// 	// let total = 0;
// 	// items.forEach((item) => {
// 	// 	total += item.price;
// 	// });
// 	// this.total = total;
// 	let total = this.items.reduce((acc, item) => acc + (item.price || 0), 0);
// 	this.total = total;
// }

// set total(total: number) {
// 	this.total = total;
// 	this._total.textContent = `${total} синапсов`;
// }

// get total(): number {
// 	return this.total;
// }
// }
