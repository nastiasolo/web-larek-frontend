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
// import { ModalWithBasket } from './components/ModalWithBasket';

const events = new EventEmitter();

const baseApi: IApi = new Api(API_URL, settings);
const api = new AppApi(baseApi);

//Кнопка корзины и обработчик клика
const basketButton = document.querySelector('.header__basket');
// basketButton.addEventListener('click', () => events.emit('basket:open'));

const itemsData = new ItemData(events);
const basketData = new BasketData(events);
const imageModal = new ModalWithItem(
	document.querySelector('#info-modal'),
	events,
	basketData
);

// const basketModal = new ModalWithBasket(
// 	document.querySelector('#basket-modal'),
// 	events
// );

// const page = new Page(document.body, events);

const itemTemplate: HTMLTemplateElement =
	document.querySelector('#card-catalog');

const itemsContainer = new ItemsContainer(document.querySelector('.gallery'));

events.onAll((event) => {
	console.log(event.eventName, event.data);
});

// const testUser = {
// 	payment: 'online',
// 	email: 'test@test.ru',
// 	phone: '+71234567890',
// 	address: 'Spb Vosstania 1',
// 	total: 2200,
// 	items: [
// 		'854cef69-976d-4c2a-a18c-2aa45046c390',
// 		'c101ab44-ed99-4a54-990d-47aa2bb4e7d9',
// 	],
// };

// const testItems = [
// 	{
// 		id: '854cef69-976d-4c2a-a18c-2aa45046c390',
// 		description: 'Если планируете решать задачи в тренажёре, берите два.',
// 		image: '/5_Dots.svg',
// 		title: '+1 час в сутках',
// 		category: 'софт-скил',
// 		price: 750,
// 	},
// 	{
// 		id: 'c101ab44-ed99-4a54-990d-47aa2bb4e7d9',
// 		description:
// 			'Лизните этот леденец, чтобы мгновенно запоминать и узнавать любой цветовой код CSS.',
// 		image: '/Shell.svg',
// 		title: 'HEX-леденец',
// 		category: 'другое',
// 		price: 1450,
// 	},
// 	{
// 		id: 'b06cde61-912f-4663-9751-09956c0eed67',
// 		description: 'Будет стоять над душой и не давать прокрастинировать.',
// 		image: '/Asterisk_2.svg',
// 		title: 'Мамка-таймер',
// 		category: 'софт-скил',
// 		price: null,
// 	},
// 	{
// 		id: '412bcf81-7e75-4e70-bdb9-d3c73c9803b7',
// 		description:
// 			'Откройте эти куки, чтобы узнать, какой фреймворк вы должны изучить дальше.',
// 		image: '/Soft_Flower.svg',
// 		title: 'Фреймворк куки судьбы',
// 		category: 'дополнительное',
// 		price: 2500,
// 	},
// 	{
// 		id: '1c521d84-c48d-48fa-8cfb-9d911fa515fd',
// 		description: 'Если орёт кот, нажмите кнопку.',
// 		image: '/mute-cat.svg',
// 		title: 'Кнопка «Замьютить кота»',
// 		category: 'кнопка',
// 		price: 2000,
// 	},
// 	{
// 		id: 'f3867296-45c7-4603-bd34-29cea3a061d5',
// 		description:
// 			'Чтобы научиться правильно называть модификаторы, без этого не обойтись.',
// 		image: 'Pill.svg',
// 		title: 'БЭМ-пилюлька',
// 		category: 'другое',
// 		price: 1500,
// 	},
// 	{
// 		id: '54df7dcb-1213-4b3c-ab61-92ed5f845535',
// 		description: 'Измените локацию для поиска работы.',
// 		image: '/Polygon.svg',
// 		title: 'Портативный телепорт',
// 		category: 'другое',
// 		price: 100000,
// 	},
// 	{
// 		id: '6a834fb8-350a-440c-ab55-d0e9b959b6e3',
// 		description: 'Даст время для изучения React, ООП и бэкенда',
// 		image: '/Butterfly.svg',
// 		title: 'Микровселенная в кармане',
// 		category: 'другое',
// 		price: 750,
// 	},
// 	{
// 		id: '48e86fc0-ca99-4e13-b164-b98d65928b53',
// 		description: 'Очень полезный навык для фронтендера. Без шуток.',
// 		image: 'Leaf.svg',
// 		title: 'UI/UX-карандаш',
// 		category: 'хард-скил',
// 		price: 10000,
// 	},
// 	{
// 		id: '90973ae5-285c-4b6f-a6d0-65d1d760b102',
// 		description: 'Сжимайте мячик, чтобы снизить стресс от тем по бэкенду.',
// 		image: '/Mithosis.svg',
// 		title: 'Бэкенд-антистресс',
// 		category: 'другое',
// 		price: 1000,
// 	},
// ];

// userData.setUserInfo(testUser);
// console.log(userData.getUserInfo());

// itemsData.items = testItems;

// console.log(itemsData.getItem('854cef69-976d-4c2a-a18c-2aa45046c390'));
// console.log(itemsData.getItem('90973ae5-285c-4b6f-a6d0-65d1d760b102'));

//Получаем товары с сервера

Promise.all([api.getItems()])
	.then(([initialItems]) => {
		itemsData.itemsResponse = initialItems;
		// console.log(itemsData.items);
		events.emit('initialData:loaded');
	})
	.catch((err) => {
		console.log(err);
	});

// const testSection = document.querySelector('.gallery');
// const item = new Item(itemTemplate, events);
// testSection.append(item.render(testItems[2]));

// const item = new Item(cloneTemplate(itemTemplate), events);
// const item1 = new Item(cloneTemplate(itemTemplate), events);
// const itemArray = [];
// itemArray.push(item.render(testItems[0]));
// itemArray.push(item1.render(testItems[1]));

// itemsContainer.render({ catalog: itemArray });

events.on('initialData:loaded', () => {
	console.log(itemsData.items);
	const itemsArray = itemsData.items.map((item) => {
		const itemInstant = new Item(cloneTemplate(itemTemplate), events);
		return itemInstant.render(item);
	});

	itemsContainer.render({ catalog: itemsArray });
});

events.on('item:select', (data: { item: Item }) => {
	const { item } = data;
	const itemData = itemsData.getItem(item.id);
	console.log(itemData, 'itemData');
	if (itemData) {
		imageModal.render({ item: itemData });
		// imageModal.open();
		imageModal.itemData = itemData;
	}
});

events.on('basket:add-item', (item: IItem) => {
	basketData.addItem(item);
});

events.on('basket:update', (data) => {
	console.log('Корзина обновлена:', data);
});

// // Блокируем прокрутку страницы если открыта модалка
// events.on('modal:open', () => {
// 	page.locked = true;
// });

// // ... и разблокируем
// events.on('modal:close', () => {
// 	page.locked = false;
// });

// events.on('basket:open', () => {
// 	basketModal.render();
// 	basketModal.open();
// });
