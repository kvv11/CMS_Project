using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace CMS.DAL.Migrations
{
    public partial class InitialMigration : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Osobe",
                columns: table => new
                {
                    id = table.Column<string>(unicode: false, maxLength: 450, nullable: false),
                    ime = table.Column<string>(maxLength: 50, nullable: false),
                    prezime = table.Column<string>(maxLength: 50, nullable: false),
                    email = table.Column<string>(maxLength: 100, nullable: false),
                    lozinka = table.Column<string>(maxLength: 255, nullable: false),
                    datum_registracije = table.Column<DateTime>(type: "datetime", nullable: true, defaultValueSql: "(getdate())"),
                    opis_profila = table.Column<string>(maxLength: 255, nullable: true),
                    uloga = table.Column<string>(maxLength: 20, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Osobe", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "Citatelji",
                columns: table => new
                {
                    id = table.Column<string>(unicode: false, maxLength: 450, nullable: false),
                    broj_komentara = table.Column<int>(nullable: true, defaultValueSql: "((0))")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Citatelji", x => x.id);
                    table.ForeignKey(
                        name: "FK_Citatelji_Osobe_Id",
                        column: x => x.id,
                        principalTable: "Osobe",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Novinari",
                columns: table => new
                {
                    id = table.Column<string>(unicode: false, maxLength: 450, nullable: false),
                    broj_clanaka = table.Column<int>(nullable: true, defaultValueSql: "((0))")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Novinari", x => x.id);
                    table.ForeignKey(
                        name: "FK_Novinari_Osobe_Id",
                        column: x => x.id,
                        principalTable: "Osobe",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Clanci",
                columns: table => new
                {
                    id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    naslov = table.Column<string>(maxLength: 255, nullable: false),
                    sadrzaj = table.Column<string>(nullable: false),
                    kategorija = table.Column<string>(maxLength: 50, nullable: true),
                    novinar_id = table.Column<string>(unicode: false, maxLength: 450, nullable: true),
                    datum_kreiranja = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    datum_izmjene = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())"),
                    ocjena = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Clanci", x => x.id);
                    table.ForeignKey(
                        name: "FK_Clanci_Novinari_Id",
                        column: x => x.novinar_id,
                        principalTable: "Novinari",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Komentari",
                columns: table => new
                {
                    id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    clanak_id = table.Column<int>(nullable: false),
                    citatelj_id = table.Column<string>(unicode: false, maxLength: 450, nullable: true),
                    sadrzaj = table.Column<string>(nullable: false),
                    ocjena = table.Column<int>(nullable: false),
                    datum_kreiranja = table.Column<DateTime>(type: "datetime", nullable: false, defaultValueSql: "(getdate())")
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Komentari", x => x.id);
                    table.ForeignKey(
                        name: "FK_Komentari_Citatelji_Id",
                        column: x => x.citatelj_id,
                        principalTable: "Citatelji",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Komentari_Clanci_Id",
                        column: x => x.clanak_id,
                        principalTable: "Clanci",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Slike",
                columns: table => new
                {
                    id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    clanak_id = table.Column<int>(nullable: false),
                    slika = table.Column<byte[]>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Slike", x => x.id);
                    table.ForeignKey(
                        name: "FK_Slike_Clanci_Id",
                        column: x => x.clanak_id,
                        principalTable: "Clanci",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Clanci_novinar_id",
                table: "Clanci",
                column: "novinar_id");

            migrationBuilder.CreateIndex(
                name: "IX_Komentari_citatelj_id",
                table: "Komentari",
                column: "citatelj_id");

            migrationBuilder.CreateIndex(
                name: "IX_Komentari_clanak_id",
                table: "Komentari",
                column: "clanak_id");

            migrationBuilder.CreateIndex(
                name: "UQ__Osobe__AB6E6164765749EB",
                table: "Osobe",
                column: "email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Slike_clanak_id",
                table: "Slike",
                column: "clanak_id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Komentari");

            migrationBuilder.DropTable(
                name: "Slike");

            migrationBuilder.DropTable(
                name: "Citatelji");

            migrationBuilder.DropTable(
                name: "Clanci");

            migrationBuilder.DropTable(
                name: "Novinari");

            migrationBuilder.DropTable(
                name: "Osobe");
        }
    }
}
