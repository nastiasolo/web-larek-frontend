import { IEvents } from './base/events';
import { Form } from './common/Form';

export class OrderForm extends Form {
	constructor(container: HTMLElement, events: IEvents) {
		super(container, events);

		// this._form.addEventListener('submit', (evt) => {
		// 	evt.preventDefault();
		// 	this.events.emit(`${this.formName}:submit`, this.getInputValues());
		// });

		// Получаем кнопки выбора способа оплаты
		const paymentButtons = this.container.querySelectorAll(
			'.order__buttons .button'
		);
		paymentButtons.forEach((button) => {
			button.addEventListener(
				'click',
				this.handlePaymentMethodSelect.bind(this)
			);
		});

		// Валидация полей ввода
		this.inputs.forEach((input) => {
			input.addEventListener('input', this.validate.bind(this));
		});
	}

	private handlePaymentMethodSelect(event: MouseEvent) {
		const target = event.target as HTMLButtonElement;

		// Удаляем активное состояние у всех кнопок
		const paymentButtons = this.container.querySelectorAll(
			'.order__buttons .button'
		);
		paymentButtons.forEach((button) =>
			button.classList.remove('button_alt-active')
		);

		// Устанавливаем активное состояние для выбранной кнопки
		target.classList.add('button_alt-active');

		// Эмитим событие с выбранным способом оплаты
		this.events.emit('order:payment-method-selected', { method: target.name });

		// Проверяем валидность формы после выбора способа оплаты
		this.validate();
	}

	protected validate() {
		let isValid = true;

		// Проверяем валидность каждого поля
		this.inputs.forEach((input) => {
			if (!input.value.trim()) {
				isValid = false;
			}
		});

		// Проверяем, выбран ли способ оплаты
		const activePaymentButton = this.container.querySelector(
			'.order__buttons .button_alt-active'
		);
		if (!activePaymentButton) {
			this.errorSpan.textContent = 'Заполните все поля';
			isValid = false;
		}

		this.valid = isValid;
		this.errorSpan.textContent = '';
	}
}
