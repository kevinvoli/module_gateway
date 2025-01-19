import { PartialType } from '@nestjs/mapped-types';
import { CreatedataDto } from './create-gateway.dto';

export class UpdateGatewayDto extends PartialType(CreatedataDto) {
  id: number;
}
