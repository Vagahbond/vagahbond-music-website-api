import {MigrationInterface, QueryRunner} from "typeorm";

export class global1617634472531 implements MigrationInterface {
    name = 'global1617634472531'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "events_booking-method_enum" AS ENUM('online', 'free', 'locally')`);
        await queryRunner.query(`CREATE TABLE "events" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(64) NOT NULL, "booking-method" "events_booking-method_enum" NOT NULL DEFAULT 'free', "bookingUrl" character varying(256), "eventDate" TIMESTAMP NOT NULL, "pictureFilename" character varying(256) NOT NULL, "location" character varying(32) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_40731c7151fe4be3116e45ddf73" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "streaming_links_streaming-platform_enum" AS ENUM('SoundHive', 'SoundCloud', 'YouTube', 'Bandcamp', 'Spotify', 'Deezer')`);
        await queryRunner.query(`CREATE TABLE "streaming_links" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "url" character varying(128) NOT NULL, "streaming-platform" "streaming_links_streaming-platform_enum" NOT NULL, "trackId" uuid NOT NULL, CONSTRAINT "PK_4e118437e643699ffdd3b779ea5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "tracks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(64) NOT NULL, "audioFileName" character varying(128) NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "releaseId" uuid NOT NULL, CONSTRAINT "PK_242a37ffc7870380f0e611986e8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "releases" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(64) NOT NULL, "coverFileName" character varying(128) NOT NULL, "releaseDate" date NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6b6fc2599a5a281dd44a7d64016" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "streaming_links" ADD CONSTRAINT "FK_348fd91c7020e11a84f0a47de85" FOREIGN KEY ("trackId") REFERENCES "tracks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "tracks" ADD CONSTRAINT "FK_0689a5f3f2c27f113101646cf1d" FOREIGN KEY ("releaseId") REFERENCES "releases"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tracks" DROP CONSTRAINT "FK_0689a5f3f2c27f113101646cf1d"`);
        await queryRunner.query(`ALTER TABLE "streaming_links" DROP CONSTRAINT "FK_348fd91c7020e11a84f0a47de85"`);
        await queryRunner.query(`DROP TABLE "releases"`);
        await queryRunner.query(`DROP TABLE "tracks"`);
        await queryRunner.query(`DROP TABLE "streaming_links"`);
        await queryRunner.query(`DROP TYPE "streaming_links_streaming-platform_enum"`);
        await queryRunner.query(`DROP TABLE "events"`);
        await queryRunner.query(`DROP TYPE "events_booking-method_enum"`);
    }

}
