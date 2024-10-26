using Microsoft.EntityFrameworkCore.Migrations;

namespace CMS.DAL.Migrations
{
    public partial class Pokusaj : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "OsobeId",
                table: "Komentari",
                newName: "osobe_id");

            migrationBuilder.RenameIndex(
                name: "IX_Komentari_OsobeId",
                table: "Komentari",
                newName: "IX_Komentari_osobe_id");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "osobe_id",
                table: "Komentari",
                newName: "OsobeId");

            migrationBuilder.RenameIndex(
                name: "IX_Komentari_osobe_id",
                table: "Komentari",
                newName: "IX_Komentari_OsobeId");
        }
    }
}
