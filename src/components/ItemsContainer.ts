import { Component } from './Component';

interface IItemsContainer {
	catalog: HTMLElement[];
}

export class ItemsContainer extends Component<IItemsContainer> {
	protected _catalog: HTMLElement;

	constructor(protected container: HTMLElement) {
		super(container);
	}

	set catalog(items: HTMLElement[]) {
		this.container.replaceChildren(...items);
	}
}
