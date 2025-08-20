import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderMeal } from '../orders.repository';

export class OrderMealRequest {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public mealId!: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  public quantity!: number;
}

export class CreateOrderRequest {
  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => OrderMealRequest)
  public meals!: OrderMealRequest[];
}

export class CreateOrderResponse {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public orderId!: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  public totalPrice!: number;

  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  public meals!: OrderMeal[];
}
