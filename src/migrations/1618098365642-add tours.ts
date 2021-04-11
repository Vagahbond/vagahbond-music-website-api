 
import {MigrationInterface, QueryRunner} from "typeorm";

export class addTours1618098365642 implements MigrationInterface {
    name = 'addTours1618098365642'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "events" RENAME COLUMN "pictureFilename" TO "tourId"`);
        await queryRunner.query(`CREATE TABLE "tours" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(64) NOT NULL, "description" character varying(512) NOT NULL, "pictureFilename" character varying(128) NOT NULL, "startDate" date NOT NULL, "endDate" date NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_2202ba445792c1ad0edf2de8de2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "tourId"`);
        await queryRunner.query(`ALTER TABLE "events" ADD "tourId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "events" ADD CONSTRAINT "FK_4231a0d58d39c0659c4b58de64b" FOREIGN KEY ("tourId") REFERENCES "tours"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "events" DROP CONSTRAINT "FK_4231a0d58d39c0659c4b58de64b"`);
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "tourId"`);
        await queryRunner.query(`ALTER TABLE "events" ADD "tourId" character varying(256) NOT NULL`);
        await queryRunner.query(`DROP TABLE "tours"`);
        await queryRunner.query(`ALTER TABLE "events" RENAME COLUMN "tourId" TO "pictureFilename"`);
    }

}
