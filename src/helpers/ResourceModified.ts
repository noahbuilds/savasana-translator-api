import { ApiProperty } from '@nestjs/swagger';

export class ResourceModified {
  @ApiProperty()
  id: string;
  constructor(id: string) {
    this.id = id;
  }
}
