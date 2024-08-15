import { IEvents } from '../base/events';
import { Component } from '../Component';

export class Modal<T> extends Component<T> {
	protected modal: HTMLElement;
	protected events: IEvents;
	protected content: T | null = null;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);
		this.events = events;
		const closeButtonElement = this.container.querySelector('.modal__close');
		closeButtonElement.addEventListener('click', this.close.bind(this));

		this.container.addEventListener('mousedown', (evt) => {
			if (evt.target === evt.currentTarget) {
				this.close();
			}
		});
		this.handleEscUp = this.handleEscUp.bind(this);
	}

	open() {
		this.container.classList.add('modal_active');
		document.addEventListener('keyup', this.handleEscUp);
	}

	close() {
		this.container.classList.remove('modal_active');
		this.content = null;
		// this.container.querySelectorAll('.modal__content').forEach(element => {
		//   element.innerHTML = '';
		// });
		document.removeEventListener('keyup', this.handleEscUp);
	}

	handleEscUp(evt: KeyboardEvent) {
		if (evt.key === 'Escape') {
			this.close();
		}
	}
}
