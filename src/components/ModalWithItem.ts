import { IItem } from '../types';
import { ensureElement } from '../utils/utils';
import { IEvents } from './base/events';
import { Modal } from './common/Modal';
import { Item } from './Item';

export interface IModalWithItem {
	addButton: HTMLButtonElement;
	item: IItem;
}

export class ModalWithItem extends Modal<IModalWithItem> {
	private addButton: HTMLButtonElement;
	private itemCategory: HTMLSpanElement;
	private itemTitle: HTMLElement;
	private itemImage: HTMLImageElement;
	private itemPrice: HTMLSpanElement;
	private itemDescription: HTMLElement;
	private currentItem: IItem | null = null;
	private handleAddButtonClick: () => void;

	constructor(container: HTMLElement, events: IEvents) {
		super(container, events);
		this.events = events;

		this.addButton = ensureElement<HTMLButtonElement>(
			'.button',
			this.container
		);
		this.itemCategory = ensureElement<HTMLSpanElement>(
			'.card__category',
			this.container
		);
		this.itemTitle = ensureElement<HTMLElement>('.card__title', this.container);
		this.itemImage = ensureElement<HTMLImageElement>(
			'.card__image',
			this.container
		);
		this.itemPrice = ensureElement<HTMLSpanElement>(
			'.card__price',
			this.container
		);
		this.itemDescription =
			ensureElement<HTMLElement>('.card__text', this.container) ?? undefined;

		this.handleAddButtonClick = () => {
			if (this.currentItem) {
				events.emit('basket:add-item', this.currentItem);
				this.updateButtonState();
				this.close();
			}
		};

		if (this.addButton) {
			this.addButton.addEventListener('click', this.handleAddButtonClick);
		}
	}

	set itemData(item: IItem) {
		this.currentItem = item;
		this.updateButtonState();

		if (this.itemCategory) {
			Item.setCategoryStyle(this.itemCategory, item.category);
			this.setText(this.itemCategory, item.category);
		}

		if (this.itemTitle) {
			this.setText(this.itemTitle, item.title);
		}
		if (this.itemImage) {
			this.itemImage.src =
				'https://larek-api.nomoreparties.co/content/weblarek/' + item.image;
		}
		if (this.itemPrice) {
			this.setText(
				this.itemPrice,
				item.price !== null ? `${item.price} синапсов` : 'Бесценно'
			);
		}

		if (this.itemDescription) {
			this.setText(this.itemDescription, item.description ?? '');
		}

		super.open();
	}

	private updateButtonState() {
		if (this.currentItem) {
			this.events.emit('item:check-button', { id: this.currentItem.id });
		}
	}

	public setButtonState(isInBasket: boolean, price: number | null) {
		if (isInBasket) {
			// Если товар уже в корзине
			this.addButton.disabled = true;
			this.setText(this.addButton, 'В корзине');
		} else if (price === null) {
			// Если цена товара равна null
			this.addButton.disabled = true;
			this.setText(this.addButton, 'Невозможно добавить');
		} else {
			// Если товар не в корзине и цена известна
			this.addButton.disabled = false;
			this.setText(this.addButton, 'В корзину');
		}
	}
}
