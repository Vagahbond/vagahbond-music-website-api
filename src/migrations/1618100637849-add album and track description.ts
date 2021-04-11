import {MigrationInterface, QueryRunner} from "typeorm";

export class addAlbumAndTrackDescription1618100637849 implements MigrationInterface {
    name = 'addAlbumAndTrackDescription1618100637849'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tracks" ADD "description" character varying(512)`);
        await queryRunner.query(`ALTER TABLE "releases" ADD "description" character varying(512)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "releases" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "tracks" DROP COLUMN "description"`);
    }

}
