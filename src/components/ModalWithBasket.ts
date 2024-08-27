import { IItem } from '../types';
import { cloneTemplate, ensureElement } from '../utils/utils';
import { IEvents } from './base/events';
import { Modal } from './common/Modal';
import { Item } from './Item';

export interface IModalWithBasket {
	items: IItem[];
	totalPrice: number;
}

export class ModalWithBasket extends Modal<IModalWithBasket> {
	private basketList: HTMLUListElement;
	private basketTotalPrice: HTMLElement;
	private checkoutButton: HTMLButtonElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(container, events);

		this.basketList = ensureElement<HTMLUListElement>(
			'.basket__list',
			this.container
		);
		this.basketTotalPrice = ensureElement<HTMLElement>(
			'.basket__price',
			this.container
		);
		this.checkoutButton = ensureElement<HTMLButtonElement>(
			'.basket-confirm-button',
			this.container
		);

		this.events.on('basket:update', this.render.bind(this));
	}

	render(data?: { items: IItem[]; totalPrice: number }): HTMLElement {
		if (!data) return this.container;

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

		if (data?.totalPrice !== undefined) {
			this.setText(this.basketTotalPrice, `${data.totalPrice} синапсов`);
		}
		return super.render(data);
	}

	private createBasketItemElement(itemData: IItem, index: number): HTMLElement {
		// Клонируем шаблон для элемента корзины
		const basketItemTemplate = cloneTemplate<HTMLElement>('#card-basket');

		// Создаем новый экземпляр Item для каждого элемента
		const itemInstance = new Item(basketItemTemplate, this.events);
		itemInstance.render(itemData);

		// Порядковый номер товара в корзине
		const indexElement = ensureElement<HTMLElement>(
			'.basket__item-index',
			basketItemTemplate
		);
		if (indexElement) {
			indexElement.textContent = (index + 1).toString();
		}

		// Добавляем событие на кнопку удаления
		const removeButton = ensureElement<HTMLButtonElement>(
			'.basket__item-delete',
			basketItemTemplate
		);
		if (removeButton) {
			removeButton.addEventListener('click', () => {
				this.events.emit('basket:remove-item', { id: itemData.id });
				event.stopPropagation();
			});
		}

		return basketItemTemplate;
	}
}
