import { BaseEntityType } from '@/core/types/base-entity.type';

export abstract class BaseEntity {
  public readonly id: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  protected constructor(base: BaseEntityType) {
    this.id = base.id;
    this.createdAt = base.createdAt;
    this.updatedAt = base.updatedAt;
  }
}
