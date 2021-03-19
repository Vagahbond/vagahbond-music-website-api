import {MigrationInterface, QueryRunner} from "typeorm";

export class AddTracks1616185720538 implements MigrationInterface {
    name = 'AddTracks1616185720538'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tracks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(64) NOT NULL, "soundCloudLink" character varying(64) NOT NULL, "youTubeLink" character varying(64) NOT NULL, "soundHiveLink" character varying(64) NOT NULL, "audioFileName" character varying(128) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_242a37ffc7870380f0e611986e8" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "tracks"`);
    }

}
