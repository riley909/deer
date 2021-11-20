import { EntityRepository, Repository } from 'typeorm';
import { ForbiddenArea } from './forbidden-area.entity';

@EntityRepository(ForbiddenArea)
export class ForbiddenAreaRepository extends Repository<ForbiddenArea> {
  async isInForbiddenArea(point) {
    const result = await this.createQueryBuilder()
      .select('forbiddenArea.id')
      .from(ForbiddenArea, 'forbidden_area')
      .where(
        `ST_CONTAINS(forbiddenArea.forbiddenAreaBoundary, ST_GEOMFROMTEXT('${point}'))`,
      )
      .getRawOne();

    if (result.length) return false;
    return true;
  }
}
