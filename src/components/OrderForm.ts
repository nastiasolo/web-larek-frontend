import { ensureAllElements, ensureElement } from '../utils/utils';
import { IEvents } from './base/events';
import { Form } from './common/Form';

export class OrderForm extends Form {
	private paymentButtons: HTMLButtonElement[];

	constructor(container: HTMLElement, events: IEvents) {
		super(container, events);

		// Получаем кнопки выбора способа оплаты
		this.paymentButtons = ensureAllElements<HTMLButtonElement>(
			'.order__buttons .button',
			this.container
		);
		this.paymentButtons.forEach((button) => {
			button.addEventListener(
				'click',
				this.handlePaymentMethodSelect.bind(this)
			);
		});

		// Валидация полей ввода
		this.validateForm();
	}

	private handlePaymentMethodSelect(event: MouseEvent) {
		const target = event.target as HTMLButtonElement;

		// Удаляем активное состояние у всех кнопок
		this.paymentButtons.forEach((button) =>
			button.classList.remove('button_alt-active')
		);

		// Устанавливаем активное состояние для выбранной кнопки
		target.classList.add('button_alt-active');

		// Эмитим событие с выбранным способом оплаты
		this.events.emit('order:payment-method-selected', { method: target.name });

		// Проверяем валидность формы после выбора способа оплаты
		this.validateForm();
	}

	protected validateForm() {
		let isValid = true;

		// Проверяем валидность каждого поля
		this.inputs.forEach((input) => {
			if (input.value.trim() === '') {
				isValid = false;
				this.showInputError();
			}
		});

		// Проверяем, выбран ли способ оплаты
		const activePaymentButton = this.container.querySelector(
			'.order__buttons .button_alt-active'
		);
		if (!activePaymentButton) {
			isValid = false;
			this.setText(this.errorSpan, 'Выберите способ оплаты');
		} else {
			this.setText(this.errorSpan, '');
		}

		this.valid = isValid;
	}

	set valid(isValid: boolean) {
		super.valid = isValid;
	}
}
