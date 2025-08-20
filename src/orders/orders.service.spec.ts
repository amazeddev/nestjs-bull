import { Test, TestingModule } from '@nestjs/testing';
import { ObjectId } from 'mongodb';
import { MealCategory, OrderStatus } from '../common/types';
import { OrderProducerService } from './orders.producer';
import { Order, OrdersRepository } from './orders.repository';
import { Meal } from '../meals/meals.repository';
import { OrdersService } from './orders.service';
import { MealsService } from '../meals/meals.service';
import { CreateOrderRequest } from './dtos/createOrder.dto';

describe('OrdersService', () => {
  let service: OrdersService;
  let ordersRepository: jest.Mocked<OrdersRepository>;
  let mealsService: jest.Mocked<MealsService>;
  let orderProducerService: jest.Mocked<OrderProducerService>;

  const mockMeal1: Meal = {
    _id: 'meal1',
    name: 'Ramen Bowl',
    category: MealCategory.Ramen,
    price: 12.99,
  };

  const mockMeal2: Meal = {
    _id: 'meal2',
    name: 'Sushi Roll',
    category: MealCategory.Sushi,
    price: 8.5,
  };

  const mockOrder: Order & { _id: ObjectId } = {
    _id: new ObjectId('68a5742f7a10b55b4a40b964'),
    status: OrderStatus.New,
    meals: [
      {
        mealId: 'meal1',
        name: 'Ramen Bowl',
        category: MealCategory.Ramen,
        price: 12.99,
        quantity: 2,
      },
      {
        mealId: 'meal2',
        name: 'Sushi Roll',
        category: MealCategory.Sushi,
        price: 8.5,
        quantity: 1,
      },
    ],
    totalPrice: 34.48,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: OrdersRepository,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
            updateOrderStatus: jest.fn(),
          },
        },
        {
          provide: MealsService,
          useValue: {
            getMeals: jest.fn(),
            getMealsByIds: jest.fn(),
          },
        },
        {
          provide: OrderProducerService,
          useValue: {
            orderCreated: jest.fn(),
            orderCooked: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    ordersRepository = module.get(OrdersRepository);
    mealsService = module.get(MealsService);
    orderProducerService = module.get(OrderProducerService);
  });

  describe('createOrder', () => {
    it('should create an order with meals and calculate total price correctly', async () => {
      // given
      const orderId = '68a5742f7a10b55b4a40b964';
      const createOrderRequest: CreateOrderRequest = {
        meals: [
          { mealId: 'meal1', quantity: 2 },
          { mealId: 'meal2', quantity: 1 },
        ],
      };

      mealsService.getMealsByIds.mockResolvedValue([mockMeal1, mockMeal2]);
      ordersRepository.create.mockResolvedValue({
        ...mockOrder,
        _id: new ObjectId(orderId),
      });
      orderProducerService.orderCreated.mockResolvedValue(undefined);

      // when
      const result = await service.createOrder(createOrderRequest);

      // then
      expect(mealsService.getMealsByIds).toHaveBeenCalledWith([
        'meal1',
        'meal2',
      ]);
      expect(ordersRepository.create).toHaveBeenCalledWith({
        status: OrderStatus.New,
        meals: [
          {
            mealId: 'meal1',
            name: 'Ramen Bowl',
            category: MealCategory.Ramen,
            price: 12.99,
            quantity: 2,
          },
          {
            mealId: 'meal2',
            name: 'Sushi Roll',
            category: MealCategory.Sushi,
            price: 8.5,
            quantity: 1,
          },
        ],
        totalPrice: 34.48,
      });
      expect(orderProducerService.orderCreated).toHaveBeenCalledWith(orderId);
      expect(result).toEqual(mockOrder);
    });
  });
});
