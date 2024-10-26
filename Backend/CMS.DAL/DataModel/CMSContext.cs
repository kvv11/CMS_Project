using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

namespace CMS.DAL.DataModel
{
    public partial class CMSContext : IdentityDbContext<ApplicationUser>
    {
        public CMSContext()
        {
        }

        public CMSContext(DbContextOptions<CMSContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Citatelji> Citatelji { get; set; }
        public virtual DbSet<Clanci> Clanci { get; set; }
        public virtual DbSet<Komentari> Komentari { get; set; }
        public virtual DbSet<Novinari> Novinari { get; set; }
        public virtual DbSet<Osobe> Osobe { get; set; }
        public virtual DbSet<Slike> Slike { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<IdentityUserLogin<string>>(entity =>
            {
                entity.HasKey(x => x.UserId);

            });

            modelBuilder.Entity<Citatelji>(entity =>
            {
                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .HasMaxLength(450)
                    .IsUnicode(false)
                    .ValueGeneratedNever();

                entity.Property(e => e.BrojKomentara)
                    .HasColumnName("broj_komentara")
                    .HasDefaultValueSql("((0))");

                entity.HasOne(d => d.IdNavigation)
                    .WithOne(p => p.Citatelji)
                    .HasForeignKey<Citatelji>(d => d.Id)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Citatelji_Osobe_Id");
            });

            modelBuilder.Entity<Clanci>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.DatumIzmjene)
                    .HasColumnName("datum_izmjene")
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.DatumKreiranja)
                    .HasColumnName("datum_kreiranja")
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.Kategorija)
                    .HasColumnName("kategorija")
                    .HasMaxLength(50);

                entity.Property(e => e.Naslov)
                    .IsRequired()
                    .HasColumnName("naslov")
                    .HasMaxLength(255);

                entity.Property(e => e.NovinarId)
                    .HasColumnName("novinar_id")
                    .HasMaxLength(450)
                    .IsUnicode(false);

                entity.Property(e => e.Ocjena).HasColumnName("ocjena");

                entity.Property(e => e.Sadrzaj)
                    .IsRequired()
                    .HasColumnName("sadrzaj");

                entity.HasOne(d => d.Novinar)
                    .WithMany(p => p.Clanci)
                    .HasForeignKey(d => d.NovinarId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Clanci_Novinari_Id");

                entity.HasMany(d => d.Slike)
                    .WithOne(p => p.Clanak)
                    .HasForeignKey(d => d.ClanakId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Slike_Clanci_Id");
            });

            modelBuilder.Entity<Komentari>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.CitateljId)
                    .HasColumnName("citatelj_id")
                    .HasMaxLength(450)
                    .IsUnicode(false);

                entity.Property(e => e.ClanakId).HasColumnName("clanak_id");

                entity.Property(e => e.DatumKreiranja)
                    .HasColumnName("datum_kreiranja")
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.Ocjena).HasColumnName("ocjena");

                entity.Property(e => e.Sadrzaj)
                    .IsRequired()
                    .HasColumnName("sadrzaj");

                entity.Property(e => e.OsobeId)
                    .HasColumnName("osobe_id")
                    .HasMaxLength(450)
                    .IsUnicode(false);

                entity.HasOne(d => d.Citatelj)
                    .WithMany(p => p.Komentari)
                    .HasForeignKey(d => d.CitateljId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Komentari_Citatelji_Id");

                entity.HasOne(d => d.Clanak)
                    .WithMany(p => p.Komentari)
                    .HasForeignKey(d => d.ClanakId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Komentari_Clanci_Id");

                entity.HasOne(d => d.Osoba)
                    .WithMany(p => p.Komentari)
                    .HasForeignKey(d => d.OsobeId)
                    .OnDelete(DeleteBehavior.Restrict)
                    .HasConstraintName("FK_Komentari_Osobe_OsobeId");
            });

            modelBuilder.Entity<Novinari>(entity =>
            {
                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .HasMaxLength(450)
                    .IsUnicode(false)
                    .ValueGeneratedNever();

                entity.Property(e => e.BrojClanaka)
                    .HasColumnName("broj_clanaka")
                    .HasDefaultValueSql("((0))");

                entity.HasOne(d => d.IdNavigation)
                    .WithOne(p => p.Novinari)
                    .HasForeignKey<Novinari>(d => d.Id)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Novinari_Osobe_Id");
            });

            modelBuilder.Entity<Osobe>(entity =>
            {
                entity.HasIndex(e => e.Email)
                    .HasName("UQ__Osobe__AB6E6164765749EB")
                    .IsUnique();

                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .HasMaxLength(450)
                    .IsUnicode(false);

                entity.Property(e => e.DatumRegistracije)
                    .HasColumnName("datum_registracije")
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.Email)
                    .IsRequired()
                    .HasColumnName("email")
                    .HasMaxLength(100);

                entity.Property(e => e.Ime)
                    .IsRequired()
                    .HasColumnName("ime")
                    .HasMaxLength(50);

                entity.Property(e => e.Lozinka)
                    .IsRequired()
                    .HasColumnName("lozinka")
                    .HasMaxLength(255);

                entity.Property(e => e.OpisProfila)
                    .HasColumnName("opis_profila")
                    .HasMaxLength(255);

                entity.Property(e => e.Prezime)
                    .IsRequired()
                    .HasColumnName("prezime")
                    .HasMaxLength(50);

                entity.Property(e => e.Uloga)
                    .IsRequired()
                    .HasColumnName("uloga")
                    .HasMaxLength(20);
            });

            modelBuilder.Entity<Slike>(entity =>
            {
                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.ClanakId).HasColumnName("clanak_id");

                entity.Property(e => e.Slika).HasColumnName("slika");

                entity.HasOne(d => d.Clanak)
                    .WithMany(p => p.Slike)
                    .HasForeignKey(d => d.ClanakId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Slike_Clanci_Id");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
