import { IBasketData, IItem } from '../types';
import { ensureElement, createElement, cloneTemplate } from '../utils/utils';
// import { Item } from './Item';
import { IEvents } from './base/events';
import { BasketData } from './BasketData';
import { Modal } from './common/Modal';
import { Item } from './Item';
import { ItemInBasket } from './ItemInBasket';
// import { cloneTemplate } from '../utils/utils';
// import { ensureElement } from '../utils/utils';

// import { createElement } from '../utils/utils';

export interface IModalWithBasket {
	items: IItem[];
	totalPrice: number;
}

export class ModalWithBasket extends Modal<IModalWithBasket> {
	private basketList: HTMLUListElement;
	private basketTotalPrice: HTMLElement;
	private checkoutButton: HTMLButtonElement;
	// private itemTemplate: HTMLTemplateElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(container, events);

		this.basketList = this.container.querySelector('.basket__list');
		this.basketTotalPrice = this.container.querySelector('.basket__price');
		this.checkoutButton = this.container.querySelector(
			'.basket-confirm-button'
		);

		this.events.on('basket:update', this.render.bind(this));
	}

	//ТУТ ОСТАНОВИЛАСЬ
	render(data?: { items: IItem[]; totalPrice: number }): HTMLElement {
		if (!data) return this.container;

		console.log(data);

		// Очищаем список перед отрисовкой новых элементов
		this.basketList.innerHTML = '';

		// Рендерим каждый товар в корзине
		if (data.items.length === 0) {
			if (this.checkoutButton) {
				this.checkoutButton.disabled = true;
			}
		} else {
			if (this.checkoutButton) {
				this.checkoutButton.disabled = false;
			}
		}
		data.items.forEach((item, index) => {
			const basketItemElement = this.createBasketItemElement(item, index);
			this.basketList.appendChild(basketItemElement);
		});

		// Клик "оформить"
		this.checkoutButton.addEventListener(
			'click',
			() => {
				this.events.emit('basket:order', { data });
			},
			{ once: true }
		);

		// 	if (data?.items) {
		// 		console.log('Items:', data?.items);
		// 		data.items.forEach((item, index) => {
		// 			const itemElement = this.createBasketItemElement(item, index);
		// 			console.log('itemElement', itemElement);
		// 			if (itemElement) {
		// 				this.basketList.appendChild(itemElement);
		// 			}
		// 		});
		// 	}

		if (data?.totalPrice !== undefined) {
			console.log(data, 'total price from render');
			this.basketTotalPrice.textContent = `${data.totalPrice} синапсов`;
		}
		return super.render(data);
	}

	// private createBasketItemElement(
	// 	item: IItem,
	// 	index: number
	// ): HTMLElement | null {
	// 	const basketItem = cloneTemplate<HTMLElement>('#card-basket');

	// 	if (!basketItem) return null;

	// 	const removeButton = basketItem.querySelector('.basket__item-delete');
	// 	if (removeButton) {
	// 		removeButton.addEventListener('click', () => {
	// 			console.log('clicked to delete');
	// 			this.events.emit('basket:remove-item', { id: item.id });
	// 		});
	// 	}

	// 	const indexElement = basketItem.querySelector('.basket__item-index');
	// 	if (indexElement) {
	// 		indexElement.textContent = (index + 1).toString();
	// 	}

	// 	const titleElement = basketItem.querySelector('.card_title');
	// 	if (titleElement) {
	// 		titleElement.textContent = item.title;
	// 	}

	// 	const priceElement = basketItem.querySelector('.card_price');
	// 	if (priceElement) {
	// 		priceElement.textContent = `${item.price ?? 'Бесценно'} синапсов`;
	// 	}

	// 	console.log(basketItem);
	// 	return basketItem;
	private createBasketItemElement(itemData: IItem, index: number): HTMLElement {
		// Клонируем шаблон для элемента корзины
		const basketItemTemplate = cloneTemplate<HTMLElement>('#card-basket');

		// Создаем новый экземпляр Item для каждого элемента
		const itemInstance = new Item(basketItemTemplate, this.events);
		itemInstance.render(itemData);

		// Порядковый номер товара в корзине
		const indexElement = basketItemTemplate.querySelector(
			'.basket__item-index'
		);
		if (indexElement) {
			indexElement.textContent = (index + 1).toString();
		}

		// Добавляем событие на кнопку удаления
		const removeButton = basketItemTemplate.querySelector(
			'.basket__item-delete'
		);
		if (removeButton) {
			removeButton.addEventListener('click', () => {
				this.events.emit('basket:remove-item', { id: itemData.id });
			});
		}

		return basketItemTemplate;
	}
}
