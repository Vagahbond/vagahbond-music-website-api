import {MigrationInterface, QueryRunner} from "typeorm";

export class test1617539745689 implements MigrationInterface {
    name = 'test1617539745689'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "streaming_links" DROP CONSTRAINT "FK_0b1b2fb219b64686cdb431144d3"`);
        await queryRunner.query(`ALTER TABLE "streaming_links" RENAME COLUMN "track" TO "trackId"`);
        await queryRunner.query(`ALTER TABLE "streaming_links" ADD CONSTRAINT "FK_348fd91c7020e11a84f0a47de85" FOREIGN KEY ("trackId") REFERENCES "tracks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "streaming_links" DROP CONSTRAINT "FK_348fd91c7020e11a84f0a47de85"`);
        await queryRunner.query(`ALTER TABLE "streaming_links" RENAME COLUMN "trackId" TO "track"`);
        await queryRunner.query(`ALTER TABLE "streaming_links" ADD CONSTRAINT "FK_0b1b2fb219b64686cdb431144d3" FOREIGN KEY ("track") REFERENCES "tracks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION DEFERRABLE INITIALLY DEFERRED`);
    }

}
