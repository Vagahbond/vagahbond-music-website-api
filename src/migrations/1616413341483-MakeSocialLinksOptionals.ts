import {MigrationInterface, QueryRunner} from "typeorm";

export class MakeSocialLinksOptionals1616413341483 implements MigrationInterface {
    name = 'MakeSocialLinksOptionals1616413341483'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tracks" ALTER COLUMN "soundCloudLink" DROP NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "tracks"."soundCloudLink" IS NULL`);
        await queryRunner.query(`ALTER TABLE "tracks" ALTER COLUMN "youTubeLink" DROP NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "tracks"."youTubeLink" IS NULL`);
        await queryRunner.query(`ALTER TABLE "tracks" ALTER COLUMN "soundHiveLink" DROP NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "tracks"."soundHiveLink" IS NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "tracks"."soundHiveLink" IS NULL`);
        await queryRunner.query(`ALTER TABLE "tracks" ALTER COLUMN "soundHiveLink" SET NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "tracks"."youTubeLink" IS NULL`);
        await queryRunner.query(`ALTER TABLE "tracks" ALTER COLUMN "youTubeLink" SET NOT NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "tracks"."soundCloudLink" IS NULL`);
        await queryRunner.query(`ALTER TABLE "tracks" ALTER COLUMN "soundCloudLink" SET NOT NULL`);
    }

}
