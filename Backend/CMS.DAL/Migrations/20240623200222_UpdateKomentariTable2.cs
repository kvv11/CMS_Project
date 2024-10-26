using Microsoft.EntityFrameworkCore.Migrations;

namespace CMS.DAL.Migrations
{
    public partial class UpdateKomentariTable2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Komentari_Osobe_OsobeId",
                table: "Komentari");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddForeignKey(
                name: "FK_Komentari_Osobe_OsobeId",
                table: "Komentari",
                column: "OsobeId",
                principalTable: "Osobe",
                principalColumn: "id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
