import { IEvents } from './base/events';
import { Modal } from './common/Modal';

export interface IModalWithSucess {
	total: number;
}

export class ModalWithSucess extends Modal<IModalWithSucess> {
	protected basketTotal: HTMLElement;
	protected sucessButton: HTMLButtonElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(container, events);
		// Элемент для отображения общей суммы
		this.basketTotal = container.querySelector('.order-success__description');
		this.sucessButton = container.querySelector('.order-success__close');

		this.sucessButton.addEventListener('click', () => {
			this.close();
		});
	}

	render(data: Partial<IModalWithSucess>): HTMLElement {
		super.render(data);
		this.setText(this.basketTotal, `Списано ${data.total} синапсов`);
		this.events.emit(`success:submit`);

		return this.container;
	}
}
