import { IEvents } from '../base/events';
import { Modal } from './Modal';

interface IForm {
	valid: boolean;
	inputValues: Record<string, string>;
	error: Record<string, string>;
}

export class Form extends Modal<IForm> {
	protected inputs: NodeListOf<HTMLInputElement>;
	protected _form: HTMLFormElement;
	protected errors: Record<string, string>;
	protected formName: string;
	protected submitButton: HTMLButtonElement;
	protected errorSpan: HTMLElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(container, events);
		this.inputs =
			this.container.querySelectorAll<HTMLInputElement>('.form__input');
		this._form = this.container.querySelector('.form');
		this.formName = this._form.getAttribute('name');
		this.submitButton = this._form.querySelector('.button-submit');
		this.errorSpan = this._form.querySelector('.form__errors');

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

	set inputValues(data: Record<string, string>) {
		this.inputs.forEach((element) => {
			element.value = data[element.name];
		});
	}

	set error(data: { field: string; value: string; validInformation: string }) {
		if (data.validInformation) {
			this.showInputError();
		} else {
			this.hideInputError();
		}
	}

	protected showInputError() {
		this.setText(this.errorSpan, 'Заполните все поля');
	}

	protected hideInputError() {
		this.setText(this.errorSpan, '');
	}

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
