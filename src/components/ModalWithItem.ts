import { IItem } from '../types';
import { IEvents } from './base/events';
import { Modal } from './common/Modal';

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
	private itemDescription?: HTMLElement;
	private currentItem: IItem | null = null;
	private handleAddButtonClick: () => void;

	constructor(container: HTMLElement, events: IEvents) {
		super(container, events);
		this.events = events;

		this.addButton = this.container.querySelector('.button');
		this.itemCategory = this.container.querySelector('.card__category');
		this.itemTitle = this.container.querySelector('.card__title');
		this.itemImage = this.container.querySelector('.card__image');
		this.itemPrice = this.container.querySelector('.card__price');
		this.itemDescription =
			this.container.querySelector('.card__text') ?? undefined;

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
			this.itemCategory.textContent = item.category;
		}

		if (this.itemTitle) {
			this.itemTitle.textContent = item.title;
		}
		if (this.itemImage) {
			this.itemImage.src =
				'https://larek-api.nomoreparties.co/content/weblarek/' + item.image;
		}
		if (this.itemPrice) {
			this.itemPrice.textContent =
				item.price !== null ? `${item.price} синапсов` : 'Бесценно';
		}

		if (this.itemDescription) {
			this.itemDescription.textContent = item.description ?? '';
		}

		super.open();
	}

	// private updateButtonState() {
	// 	// Проверка, если текущий элемент и его цена установлены
	// 	if (this.currentItem) {
	// 		// Если товар уже в корзине
	// 		if (this.basketData.isItemInBasket(this.currentItem.id)) {
	// 			this.addButton.disabled = true;
	// 			this.addButton.textContent = 'В корзине';
	// 		}
	// 		// Если цена товара равна null
	// 		else if (this.currentItem.price === null) {
	// 			this.addButton.disabled = true;
	// 			this.addButton.textContent = 'Невозможно добавить';
	// 		}
	// 		// Если товар не в корзине и цена известна
	// 		else {
	// 			this.addButton.disabled = false;
	// 			this.addButton.textContent = 'В корзину';
	// 		}
	// 	}
	// }

	private updateButtonState() {
		if (this.currentItem) {
			this.events.emit('item:check-button', { id: this.currentItem.id });
		}
	}

	public setButtonState(isInBasket: boolean, price: number | null) {
		if (isInBasket) {
			this.addButton.disabled = true;
			this.addButton.textContent = 'В корзине';
		} else if (price === null) {
			this.addButton.disabled = true;
			this.addButton.textContent = 'Невозможно добавить';
		} else {
			this.addButton.disabled = false;
			this.addButton.textContent = 'В корзину';
		}
	}
}
