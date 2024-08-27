import { IEvents } from './base/events';
import { IItem } from '../types/index';
import { Component } from './Component';

export class Item extends Component<IItem> {
	protected element: HTMLElement;
	protected events: IEvents;
	protected itemButton?: HTMLButtonElement;
	protected itemCategory?: HTMLSpanElement;
	protected itemTitle: HTMLElement;
	protected itemImage?: HTMLImageElement;
	protected itemPrice?: HTMLSpanElement;
	protected itemId: string;
	protected itemDescription?: HTMLElement;

	constructor(protected container: HTMLElement, events: IEvents) {
		super(container);
		this.events = events;

		this.itemCategory = this.container.querySelector('.card__category');
		this.itemTitle = this.container.querySelector('.card__title');
		this.itemImage = this.container.querySelector('.card__image');
		this.itemPrice = this.container.querySelector('.card__price');
		this.itemDescription =
			this.container.querySelector('.card__text') ?? undefined;
		this.itemButton = this.container.querySelector('.card-add-button');

		this.container.addEventListener('click', () => {
			this.events.emit('item:select', { item: this });
		});
	}

	render(data?: Partial<IItem>): HTMLElement;

	render(itemData: Partial<IItem> | undefined) {
		if (!itemData) return this.container;
		return super.render(itemData);
	}

	set description(description: string) {
		if (this.itemDescription) {
			this.itemDescription.textContent = description;
		}
	}

	public static setCategoryStyle(element: HTMLElement, category: string) {
		if (element) {
			element.className = 'card__category';
			switch (category) {
				case 'софт-скил':
					element.classList.add('card__category_soft');
					break;
				case 'хард-скил':
					element.classList.add('card__category_hard');
					break;
				case 'другое':
					element.classList.add('card__category_other');
					break;
				case 'дополнительное':
					element.classList.add('card__category_additional');
					break;
				case 'кнопка':
					element.classList.add('card__category_button');
					break;
				default:
					element.style.backgroundColor = 'blue';
					break;
			}
			element.textContent = category;
		}
	}

	set category(category: string) {
		Item.setCategoryStyle(this.itemCategory, category);
	}

	set image(image: string) {
		if (this.itemImage) {
			this.itemImage.src =
				'https://larek-api.nomoreparties.co/content/weblarek/' + image;
		}
	}

	set price(price: number | null) {
		if (this.itemPrice) {
			if (price === null) {
				this.itemPrice.textContent = 'Бесценно';
			} else {
				this.itemPrice.textContent = price.toString() + ' синапсов';
			}
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
