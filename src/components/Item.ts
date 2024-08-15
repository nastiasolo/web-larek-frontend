import { cloneTemplate } from '../utils/utils';
import { IEvents } from './base/events';
import { IItem } from '../types/index';
import { Component } from './Component';

export class Item extends Component<IItem> {
	protected element: HTMLElement;
	protected events: IEvents;
	protected itemButton: HTMLButtonElement;
	protected itemCategory: HTMLSpanElement;
	protected itemTitle: HTMLElement;
	protected itemImage: HTMLImageElement;
	protected itemPrice: HTMLSpanElement;
	protected itemId: string;
	protected itemDescription?: HTMLElement;

	constructor(protected container: HTMLElement, events: IEvents) {
		super(container);
		this.events = events;
		// this.element = cloneTemplate(template);

		this.itemCategory = this.container.querySelector('.card__category');
		this.itemTitle = this.container.querySelector('.card__title');
		this.itemImage = this.container.querySelector('.card__image');
		this.itemPrice = this.container.querySelector('.card__price');
		this.itemDescription =
			this.container.querySelector('.card__text') ?? undefined;
		// this.itemButton = this.container.querySelector('.gallery__item');
		// if (!this.itemButton) {
		// 	console.error('Item button not found');
		// 	return;
		// }

		this.container.addEventListener('click', () => {
			this.events.emit('item:select', { item: this });
		});

		//добавить метод, добавлен ли товар в корзину или нет
	}

	render(data?: Partial<IItem>): HTMLElement;

	render(itemData: Partial<IItem> | undefined) {
		if (!itemData) return this.container;
		// Object.assign(this, itemData);
		// return this.element;
		return super.render(itemData);
	}

	set description(description: string) {
		if (this.itemDescription) {
			this.itemDescription.textContent = description;
		}
	}

	set category(category: string) {
		this.itemCategory.textContent = category;
	}

	set image(image: string) {
		this.itemImage.src =
			'https://larek-api.nomoreparties.co/content/weblarek/' + image;
	}

	set price(price: number | null) {
		if (price === null) {
			this.itemPrice.textContent = 'Бесценно';
		} else {
			this.itemPrice.textContent = price.toString() + ' синапсов';
		}
	}

	set title(title: string) {
		this.itemTitle.textContent = title;
	}

	set id(id) {
		this.itemId = id;
	}
	get id() {
		return this.itemId;
	}
}
