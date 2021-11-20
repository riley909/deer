import { EntityRepository, Repository } from 'typeorm';
import { Area } from './area.entity';

@EntityRepository(Area)
export class AreaRepository extends Repository<Area> {
  async findOneAreaEntity(id: string) {
    const result = await this.createQueryBuilder()
      .select(['area.area_id', 'ST_AsText(area.area_boundary)'])
      .from(Area, 'area')
      .where('area.area_id = :id', { id })
      .getRawOne();

    console.log('results', result);
    return result;
  }

  async isOutOfRange(point: string) {
    const result = await this.createQueryBuilder()
      .select('area.area_id')
      .from(Area, 'area')
      .where(`ST_CONTAINS(area.area_boundary, ST_GEOMFROMTEXT(${point}))`)
      .getRawOne();

    console.log('results', result.length);

    if (result.length) return false;
    else return true;
  }

  async distanceFromBoundary(point, linestring) {
    const result = await this.createQueryBuilder()
      .select([
        `ST_DISTANCE( ST_GeomFromText( ${point})`,
        `ST_GeomFromText( ${linestring})) AS DISTANCE`,
      ])
      .getRawOne();

    return result;
  }

  // async createAreaEntity() {
  //   const polygon = 'POLYGON( ( 0 0, 10 0, 10 10, 0 10, 0 0 ) )';
  //   const point = 'Point(0 0)';
  //   const coords = 'LINESTRING ( 0 0, 10 0, 10 10, 0 10, 0 0 )';

  //   const result = await this.createQueryBuilder()
  //     .insert()
  //     .into(Area)
  //     .values({
  //       area_boundary: () => `ST_GeomFromText('${polygon}')`,
  //       area_center: () => `ST_GeomFromText('${point}')`,
  //       area_coords: () => `ST_GeomFromText('${coords}')`,
  //     })
  //     .execute();

  //   console.log('results', result);
  //   return result;
  // }

  // async findPoint() {
  //   let result;

  //   try {
  //     result = await this.createQueryBuilder()
  //       .select(['area.area_id', 'ST_AsText(area.area_boundary)'])
  //       .from(Area, 'area')
  //       .where(
  //         `ST_CONTAINS(area.area_boundary, ST_GEOMFROMTEXT('POLYGON( ( 1 1, 2 1, 2 2, 1 2, 1 1 ) )'))`,
  //       )
  //       .getRawOne();
  //   } catch (error) {
  //     throw new Error(error);
  //   }
  //   console.log('results', result);
  //   return result;
  // }
}
