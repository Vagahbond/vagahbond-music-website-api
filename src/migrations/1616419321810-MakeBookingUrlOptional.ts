import {MigrationInterface, QueryRunner} from "typeorm";

export class MakeBookingUrlOptional1616419321810 implements MigrationInterface {
    name = 'MakeBookingUrlOptional1616419321810'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "events" ALTER COLUMN "bookingUrl" DROP NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "events"."bookingUrl" IS NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "events"."bookingUrl" IS NULL`);
        await queryRunner.query(`ALTER TABLE "events" ALTER COLUMN "bookingUrl" SET NOT NULL`);
    }

}
