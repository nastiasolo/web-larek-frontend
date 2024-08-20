import { IEvents } from '../base/events';
import { Modal } from './Modal';

interface IForm {
	valid: boolean;
	inputValues: Record<string, string>;
	error: Record<string, string>;
}

export class Form extends Modal<IForm> {
	protected inputs: NodeListOf<HTMLInputElement>;
	// protected buttonInput?: HTMLButtonElement;
	protected _form: HTMLFormElement;
	protected errors: Record<string, string>;
	protected formName: string;
	protected submitButton: HTMLButtonElement;
	protected errorSpan: HTMLElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(container, events);
		this.inputs =
			this.container.querySelectorAll<HTMLInputElement>('.form__input');
		// this.container.querySelectorAll<HTMLButtonElement>('.button_alt');
		this._form = this.container.querySelector('.form');
		this.formName = this._form.getAttribute('name');
		this.submitButton = this._form.querySelector('.button-submit');
		this.errorSpan = this._form.querySelector('.form__errors');
		console.log(this.errorSpan);
		//	this.errors = {};

		// this.inputs.forEach((input) => {
		// 	const errorElement = this._form.querySelector('.form__errors');
		// 	if (errorElement) {
		// 		this.errors[input.name] = errorElement;
		// 	}
		// });

		this._form.addEventListener('submit', (evt) => {
			evt.preventDefault();
			this.events.emit(`${this.formName}:submit`, this.getInputValues());
		});

		this._form.addEventListener('input', (event: InputEvent) => {
			const target = event.target as HTMLInputElement;
			const field = target.name;
			const value = target.value;

			// Удаляем ошибку при вводе корректных данных
			if (value.trim() !== '') {
				// delete this.errors[field];
				this.hideInputError();
			}
			this.validateForm();
			this.events.emit(`${this.formName}:input`, { field, value });
		});
	}

	protected getInputValues() {
		const valuesObject: Record<string, string> = {};
		this.inputs.forEach((element) => {
			valuesObject[element.name] = element.value;
		});
		return valuesObject;
	}

	// // Валидация отдельного поля ввода
	// protected validateInput(input: HTMLInputElement) {
	// 	if (input.value.trim() === '') {
	// 		this.showInputError(input.name, 'Это поле обязательно для заполнения');
	// 	} else {
	// 		this.hideInputError(input.name);
	// 	}
	// }

	set inputValues(data: Record<string, string>) {
		this.inputs.forEach((element) => {
			element.value = data[element.name];
		});
	}

	set error(data: { field: string; value: string; validInformation: string }) {
		if (data.validInformation) {
			// this.errors[data.field] = data.validInformation;
			this.showInputError();
		} else {
			// delete this.errors[data.field];
			this.hideInputError();
		}
	}

	protected showInputError() {
		// const errorMessages = Object.values(this.errors).join(' ');
		this.errorSpan.textContent = 'Заполните все поля';
	}

	protected hideInputError() {
		this.errorSpan.textContent = '';
	}

	// protected showInputError(field: string, errorMessage: string) {
	// 	this._form[field].classList.add('&:invalid');
	// 	// this.errors[field].textContent = errorMessage;
	// 	const errorElement = this.errors[field];
	// 	if (errorElement) {
	// 		errorElement.textContent = errorMessage;
	// 	}
	// }

	// protected hideInputError(field: string) {
	// 	this._form[field].classList.remove('&:invalid');
	// 	// this.errors[field].textContent = '';
	// 	if (errorElement) {
	// 		errorElement.textContent = '';
	// 	}
	// }

	protected validateForm() {
		let isValid = true;

		this.inputs.forEach((input) => {
			if (input.value.trim() === '') {
				isValid = false;
				this.showInputError();
			}
		});

		this.valid = isValid;
	}

	set valid(isValid: boolean) {
		console.log({ isValid });
		this.submitButton.classList.toggle('disabled', !isValid);
		this.submitButton.disabled = !isValid;
	}

	get form() {
		return this._form;
	}

	close() {
		super.close();
		this._form.reset();
		this.errors = {};
		this.hideInputError();
	}
}
