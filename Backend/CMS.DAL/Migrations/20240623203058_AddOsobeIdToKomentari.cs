using Microsoft.EntityFrameworkCore.Migrations;

namespace CMS.DAL.Migrations
{
    public partial class AddOsobeIdToKomentari : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "OsobeId",
                table: "Komentari",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Komentari_OsobeId",
                table: "Komentari",
                column: "OsobeId");

            migrationBuilder.AddForeignKey(
                name: "FK_Komentari_Osobe_OsobeId",
                table: "Komentari",
                column: "OsobeId",
                principalTable: "Osobe",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Komentari_Osobe_OsobeId",
                table: "Komentari");

            migrationBuilder.DropIndex(
                name: "IX_Komentari_OsobeId",
                table: "Komentari");

            migrationBuilder.DropColumn(
                name: "OsobeId",
                table: "Komentari");
        }
    }
}
