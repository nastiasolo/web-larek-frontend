import { AppApi } from './components/AppApi';
import { EventEmitter } from './components/base/events';
import { ItemData } from './components/ItemsData';
import './scss/styles.scss';
import { IApi, IItem } from './types';
import { Api } from './components/base/api';
import { API_URL, settings } from './utils/constants';
import { Item } from './components/Item';
import { ItemsContainer } from './components/ItemsContainer';
import { cloneTemplate } from './utils/utils';
import { ModalWithItem } from './components/ModalWithItem';
import { BasketData } from './components/BasketData';
import { ModalWithBasket } from './components/ModalWithBasket';
import { Form } from './components/common/Form';
import { OrderForm } from './components/OrderForm';
import { ModalWithSucess } from './components/ModalWithSucess';
import { UserData } from './components/UserData';

const events = new EventEmitter();
const baseApi: IApi = new Api(API_URL, settings);
const api = new AppApi(baseApi);

// Чтобы мониторить все события, для отладки
events.onAll((event) => {
	console.log(event.eventName, event.data);
});

// Шаблон
const itemTemplate: HTMLTemplateElement =
	document.querySelector('#card-catalog');

// Модель данных
const itemsData = new ItemData(events);
const basketData = new BasketData(events);
const userData = new UserData();

//Модальные окна
const itemModal = new ModalWithItem(
	document.querySelector('#info-modal'),
	events
);

const basketModal = new ModalWithBasket(
	document.querySelector('#basket-modal'),
	events
);

const successModal = new ModalWithSucess(
	document.querySelector('.success-modal'),
	events
);

//Формы
const orderForm = new OrderForm(document.querySelector('#order-modal'), events);
const contactForm = new Form(document.querySelector('#contact-modal'), events);

//Кнопка корзины и обработчик клика
const basketButton = document.querySelector('.header__basket');
basketButton.addEventListener('click', () => {
	events.emit('basket:open', {
		items: basketData.getItems(),
		totalPrice: basketData.getTotalPrice(),
	});
});

//Счетчик товаров в корзине
const basketCounter = document.querySelector('.header__basket-counter');

// Корзина открыта
events.on('basket:open', (data: { items: IItem[]; totalPrice: number }) => {
	basketModal.render(data);
	basketModal.open();
});

// Контейнер - "галлерея"
const itemsContainer = new ItemsContainer(document.querySelector('.gallery'));

// Получаем карточки с сервера
Promise.all([api.getItems()])
	.then(([initialItems]) => {
		itemsData.itemsResponse = initialItems;
		events.emit('initialData:loaded');
	})
	.catch((err) => {
		console.log(err);
	});

// Загрузка данных с сервера
events.on('initialData:loaded', () => {
	const itemsArray = itemsData.items.map((item) => {
		const itemInstant = new Item(cloneTemplate(itemTemplate), events);
		return itemInstant.render(item);
	});

	itemsContainer.render({ catalog: itemsArray });
});

// Клик по товару и открытие модального окна с подробной инфой о товаре
events.on('item:select', (data: { item: Item }) => {
	const { item } = data;
	const itemData = itemsData.getItem(item.id);
	if (itemData) {
		events.emit('item:check-button', { id: itemData.id });
		itemModal.render({ item: itemData });
		itemModal.itemData = itemData;
	}
});

// Добавился товар в корзину
events.on('basket:add-item', (item: IItem) => {
	basketData.addItem(item);
	events.emit('item:check-button', { id: item.id });
});

// Удаление товара из корзины
events.on('basket:remove-item', ({ id }: { id: string }) => {
	basketData.removeItem(id);
	events.emit('item:check-button', { id });
});

//Кнопка "Добавить в корзину"
events.on('item:check-button', (data: { id: string }) => {
	const itemId = data.id;
	const isInBasket = basketData.isItemInBasket(itemId);
	const item = itemsData.getItem(itemId); //текущий товар
	const price = item ? item.price : null;
	if (item) {
		itemModal.setButtonState(isInBasket, price);
	}
});

// Обновление корзины
events.on('basket:update', (data: { items: IItem[]; totalPrice: number }) => {
	basketCounter.textContent = basketData.getTotalItems().toString();
});

// Корзина подтверждена
events.on(
	'basket:order',
	(basketData: { data: { items: IItem[]; totalPrice: number } }) => {
		// Только id товаров
		const itemIds = basketData.data.items.map((item) => item.id);
		userData.updateData({
			items: itemIds,
			total: basketData.data.totalPrice,
		});
		basketModal.close();
		orderForm.open();
	}
);

//Выбран метод оплаты
events.on(
	'order:payment-method-selected',
	(paymentData: { method: string }) => {
		const paymentMethod = paymentData.method === 'card' ? 'online' : 'offline';
		userData.updateData({ payment: paymentMethod });
	}
);

//Форма "order" подтверждена
events.on('order:submit', (orderData: { address: string }) => {
	userData.updateData({ address: orderData.address });
	console.log(userData, 'address added');

	orderForm.close();
	contactForm.open();
});

events.on('contact:submit', (contactData: { email: string; phone: string }) => {
	userData.updateData({ email: contactData.email, phone: contactData.phone });
	contactForm.close();
	const total = basketData.getTotalPrice();
	api
		.setOrder(userData.getData())
		.then((result) => {
			console.log(result);
			successModal.render({ total });
			successModal.open();
		})
		.catch((err) => {
			console.error(err);
		});
});

events.on('success:submit', () => {
	basketData.clearBasket();
});
