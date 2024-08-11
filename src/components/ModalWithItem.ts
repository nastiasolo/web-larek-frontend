import { IItem } from '../types';
import { IEvents } from './base/events';
import { Modal } from './common/Modal';

export interface IModalWithItem {
	addButton: HTMLButtonElement;
	item: IItem;
}

export class ModalWithItem extends Modal<IModalWithItem> {
	protected addButton: HTMLButtonElement;
	protected itemCategory: HTMLSpanElement;
	protected itemTitle: HTMLElement;
	protected itemImage: HTMLImageElement;
	protected itemPrice: HTMLSpanElement;
	protected itemDescription?: HTMLElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(container, events);
		this.addButton = this.container.querySelector('.button');
		this.itemCategory = this.container.querySelector('.card__category');
		this.itemTitle = this.container.querySelector('.card__title');
		this.itemImage = this.container.querySelector('.card__image');
		this.itemPrice = this.container.querySelector('.card__price');
		this.itemDescription =
			this.container.querySelector('.card__text') ?? undefined;
	}

	set itemData(item: IItem) {
		this.itemCategory.textContent = item.category;
		this.itemTitle.textContent = item.title;
		this.itemImage.src =
			'https://larek-api.nomoreparties.co/content/weblarek/' + item.image;
		this.itemPrice.textContent =
			item.price !== null ? `${item.price} синапсов` : 'Бесценно';

		if (this.itemDescription) {
			this.itemDescription.textContent = item.description ?? '';
		}
		super.open();
	}
}
