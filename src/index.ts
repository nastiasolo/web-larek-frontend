import { AppApi } from './components/AppApi';
import { EventEmitter } from './components/base/events';
import { ItemData } from './components/ItemsData';
import './scss/styles.scss';
import { IApi, IItem } from './types';
import { Api } from './components/base/api';
import { API_URL, settings } from './utils/constants';
import { testItems } from './utils/tempConstants';
import { Item } from './components/Item';
import { ItemsContainer } from './components/ItemsContainer';
import { cloneTemplate } from './utils/utils';
import { ModalWithItem } from './components/ModalWithItem';
import { BasketData } from './components/BasketData';
import { ModalWithBasket } from './components/ModalWithBasket';
import { Form } from './components/common/Form';
import { OrderForm } from './components/OrderForm';
import { Modal } from './components/common/Modal';
import { ModalWithSucess } from './components/ModalWithSucess';

const events = new EventEmitter();
const baseApi: IApi = new Api(API_URL, settings);
const api = new AppApi(baseApi);

// Чтобы мониторить все события, для отладки
events.onAll((event) => {
	console.log(event.eventName, event.data);
});

// Все шаблоны
const itemTemplate: HTMLTemplateElement =
	document.querySelector('#card-catalog');
// const basketTemplate: HTMLTemplateElement = document.querySelector('#basket');
const orderFormTemplate: HTMLTemplateElement = document.querySelector('#order');
const successTemplate: HTMLTemplateElement = document.querySelector('#success');
console.log(orderFormTemplate);

// Модель данных
const itemsData = new ItemData(events);
const basketData = new BasketData(events);

//Модальные окна
const itemModal = new ModalWithItem(
	document.querySelector('#info-modal'),
	events,
	basketData
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

// events.on('basket:open', () => {
// 	const basketList = basketData.getItems();
// 	console.log(basketList);
// 	basketList.map((item) => {
// 		const basketItem = cloneTemplate<HTMLElement>('#card-basket');
// 		const titleElement = basketItem.querySelector('.card_title');
// 		titleElement.textContent = item.title;
// 		const priceElement = basketItem.querySelector('.card_price');
// 		priceElement.textContent = item.price.toString();
// 	});
// });

// Корзина открыта
events.on('basket:open', (data: { items: IItem[]; totalPrice: number }) => {
	console.log('Корзина открыта');
	basketModal.render(data);

	//ПОДУМАТЬ ТУТ
	// const basketItemTemplate = cloneTemplate<HTMLTemplateElement>('#card-basket');
	// const itemsArray = data.items.map((item) => {
	// 	const itemInstant = new Item(cloneTemplate(basketItemTemplate), events);
	// 	return itemInstant.render(item);
	//});

	// basketModal.render({ items: itemsArray });
	basketModal.open();
});

// const page = new Page(document.body, events);

// Контейнер - "галлерея"
const itemsContainer = new ItemsContainer(document.querySelector('.gallery'));

// Получаем карточки с сервера
Promise.all([api.getItems()])
	.then(([initialItems]) => {
		itemsData.itemsResponse = initialItems;
		// console.log(itemsData.items);
		events.emit('initialData:loaded');
	})
	.catch((err) => {
		console.log(err);
	});

// Загрузка данных с сервера
events.on('initialData:loaded', () => {
	console.log(itemsData.items);
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
	console.log(itemData, 'itemData');
	if (itemData) {
		itemModal.render({ item: itemData });
		itemModal.itemData = itemData;
	}
});

// Добавился товар в корзину
events.on('basket:add-item', (item: IItem) => {
	basketData.addItem(item);
	events.emit('basket:update', basketData);
});

// Удаление товара из корзины
events.on('basket:remove-item', ({ id }: { id: string }) => {
	basketData.removeItem(id);
});

// Обновление корзины
events.on('basket:update', (data: { items: IItem[]; totalPrice: number }) => {
	console.log('Корзина обновлена:', data);
	console.log('Количетсов товаров в корзине', basketData.getTotalItems());
	basketCounter.textContent = basketData.getTotalItems().toString();
	//	basketModal.render(data: { items: IItem[]; totalPrice: number });
});

// Корзина подтверждена
events.on('basket:order', () => {
	basketModal.close();
	// orderForm.render();
	orderForm.open();
});

//Форма "order" подтверждена
events.on('order:submit', () => {
	orderForm.close();
	contactForm.open();
});

events.on('contact:submit', () => {
	contactForm.close();
	const total = basketData.getTotalPrice();
	successModal.render({ total });
	successModal.open();
});

events.on('success:submit', () => {
	basketData.clearBasket();
});

// Не забыть переписать документацию!!!!!
