import { ApiProperty } from '@nestjs/swagger';

export class ResourceCreated {
  @ApiProperty()
  id: string;
  constructor(id: string) {
    this.id = id;
  }
}
