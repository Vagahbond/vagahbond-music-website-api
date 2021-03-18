import {MigrationInterface, QueryRunner} from "typeorm";

export class AddEvents1616022280867 implements MigrationInterface {
    name = 'AddEvents1616022280867'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "events_booking_method_enum" AS ENUM('online', 'free', 'locally')`);
        await queryRunner.query(`CREATE TABLE "events" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(64) NOT NULL, "booking_method" "events_booking_method_enum" NOT NULL DEFAULT 'free', "bookingUrl" character varying(256) NOT NULL, "eventDate" TIMESTAMP NOT NULL, "pictureFilename" character varying(256) NOT NULL, "location" character varying(32) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_40731c7151fe4be3116e45ddf73" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "events"`);
        await queryRunner.query(`DROP TYPE "events_booking_method_enum"`);
    }

}
