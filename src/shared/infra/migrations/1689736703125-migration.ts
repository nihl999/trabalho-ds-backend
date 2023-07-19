import { MigrationInterface, QueryRunner } from "typeorm";

export class migration1689736703125 implements MigrationInterface {
    name = 'migration1689736703125'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "espaco" (
                "id" character varying NOT NULL,
                "nome" character varying NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_ecd6cb92bf5a0337f30cecee110" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."inventario_status_enum" AS ENUM('0', '1', '2', '3')
        `);
        await queryRunner.query(`
            CREATE TABLE "inventario" (
                "id" SERIAL NOT NULL,
                "idSolicitacao" character varying NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "status" "public"."inventario_status_enum" NOT NULL,
                "responsavelId" integer,
                CONSTRAINT "PK_90f2b8f62985685e15fea12e237" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "patrimonios" (
                "numero" integer NOT NULL,
                "espacoInventarioInventarioId" integer NOT NULL,
                "descricao" text NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "lido" boolean NOT NULL DEFAULT false,
                "data_leitura" TIMESTAMP,
                "observacao" character varying,
                "tipo_criacao" integer NOT NULL,
                "espacoInventarioEspacoId" character varying,
                "responsavelId" integer,
                CONSTRAINT "PK_4e8be1a2e27da782e4778cdff8c" PRIMARY KEY ("numero", "espacoInventarioInventarioId")
            )
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."espaco_inventario_status_enum" AS ENUM('0', '1', '2')
        `);
        await queryRunner.query(`
            CREATE TABLE "espaco_inventario" (
                "espacoId" character varying NOT NULL,
                "inventarioId" integer NOT NULL,
                "quantidade_patrimonios" integer NOT NULL,
                "patrimonios_lidos" integer NOT NULL,
                "status" "public"."espaco_inventario_status_enum" NOT NULL,
                "responsavelId" integer,
                CONSTRAINT "PK_830aebf9246934dbbdf1b5abcd2" PRIMARY KEY ("espacoId", "inventarioId")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "usuario" (
                "id" SERIAL NOT NULL,
                "nome" character varying NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "update_at" TIMESTAMP NOT NULL DEFAULT now(),
                "cargo" integer,
                CONSTRAINT "pk_user_id" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "cargo" (
                "id" SERIAL NOT NULL,
                "nome" character varying NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_1af8b2a790f35aedbe7e3da4199" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "inventario"
            ADD CONSTRAINT "FK_03e63909f6f2a1ea43d3c4fee26" FOREIGN KEY ("responsavelId") REFERENCES "usuario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "patrimonios"
            ADD CONSTRAINT "FK_bbfca39a293ee32039ea806defd" FOREIGN KEY (
                    "espacoInventarioEspacoId",
                    "espacoInventarioInventarioId"
                ) REFERENCES "espaco_inventario"("espacoId", "inventarioId") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "patrimonios"
            ADD CONSTRAINT "FK_6a609be6cb7b7b6a961e1c4b76c" FOREIGN KEY ("responsavelId") REFERENCES "usuario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "espaco_inventario"
            ADD CONSTRAINT "FK_5f4fc1ebee32fb213f2177d4531" FOREIGN KEY ("inventarioId") REFERENCES "inventario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "espaco_inventario"
            ADD CONSTRAINT "FK_6046b988d30d01c5d14f801e8f4" FOREIGN KEY ("responsavelId") REFERENCES "usuario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "espaco_inventario"
            ADD CONSTRAINT "FK_de2c89a524e185882c156401cd7" FOREIGN KEY ("espacoId") REFERENCES "espaco"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "usuario"
            ADD CONSTRAINT "FK_e33bcf30dcc7187d7f2c9e5332b" FOREIGN KEY ("cargo") REFERENCES "cargo"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "usuario" DROP CONSTRAINT "FK_e33bcf30dcc7187d7f2c9e5332b"
        `);
        await queryRunner.query(`
            ALTER TABLE "espaco_inventario" DROP CONSTRAINT "FK_de2c89a524e185882c156401cd7"
        `);
        await queryRunner.query(`
            ALTER TABLE "espaco_inventario" DROP CONSTRAINT "FK_6046b988d30d01c5d14f801e8f4"
        `);
        await queryRunner.query(`
            ALTER TABLE "espaco_inventario" DROP CONSTRAINT "FK_5f4fc1ebee32fb213f2177d4531"
        `);
        await queryRunner.query(`
            ALTER TABLE "patrimonios" DROP CONSTRAINT "FK_6a609be6cb7b7b6a961e1c4b76c"
        `);
        await queryRunner.query(`
            ALTER TABLE "patrimonios" DROP CONSTRAINT "FK_bbfca39a293ee32039ea806defd"
        `);
        await queryRunner.query(`
            ALTER TABLE "inventario" DROP CONSTRAINT "FK_03e63909f6f2a1ea43d3c4fee26"
        `);
        await queryRunner.query(`
            DROP TABLE "cargo"
        `);
        await queryRunner.query(`
            DROP TABLE "usuario"
        `);
        await queryRunner.query(`
            DROP TABLE "espaco_inventario"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."espaco_inventario_status_enum"
        `);
        await queryRunner.query(`
            DROP TABLE "patrimonios"
        `);
        await queryRunner.query(`
            DROP TABLE "inventario"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."inventario_status_enum"
        `);
        await queryRunner.query(`
            DROP TABLE "espaco"
        `);
    }

}
