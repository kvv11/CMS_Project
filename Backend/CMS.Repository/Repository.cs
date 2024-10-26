using CMS.DAL.DataModel;
using CMS.Model;
using CMS.Repository.Common;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CMS.Repository
{
    public class Repository : IRepository
    {
        private readonly CMSContext _context;
        public Repository(CMSContext context)
        {
            _context = context;
        }

        public IEnumerable<Osobe> PrikaziSveOsobe()
        {
            return _context.Osobe.ToList();
        }

        public void AddClanak(Clanci clanak)
        {
            _context.Clanci.Add(clanak);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }

        public IEnumerable<Clanci> GetAllClanci()
        {
            return _context.Clanci.Include(c => c.Slike).ToList();
        }

        public Clanci GetClanakById(int id)
        {
            return _context.Clanci.Include(c => c.Slike).FirstOrDefault(c => c.Id == id);
        }

        public void AddKomentar(Komentari komentar)
        {
            _context.Komentari.Add(komentar);
        }

        public IEnumerable<Komentari> PrikaziKomentareZaClanak(int clanakId)
        {
            return _context.Komentari.Where(k => k.ClanakId == clanakId).ToList();
        }
        public Osobe PrikaziOsobuPoId(string id) 
        {
            return _context.Osobe.FirstOrDefault(o => o.Id == id);
        }

        public async Task UpdateClanakAsync(Clanci clanak)
        {
            _context.Clanci.Update(clanak);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> DeleteSlikaAsync(int clanakId, int slikaId)
        {
            var clanak = await _context.Clanci.Include(c => c.Slike).FirstOrDefaultAsync(c => c.Id == clanakId);
            if (clanak == null) return false;

            var slika = clanak.Slike.FirstOrDefault(s => s.Id == slikaId);
            if (slika == null) return false;

            clanak.Slike.Remove(slika);
            _context.Slike.Remove(slika);

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteClanakAsync(int id)
        {
            var clanak = await _context.Clanci.Include(c => c.Slike).Include(c => c.Komentari).FirstOrDefaultAsync(c => c.Id == id);
            if (clanak == null) return false;


            foreach (var slika in clanak.Slike)
            {
                _context.Slike.Remove(slika);
            }

        
            foreach (var komentar in clanak.Komentari)
            {
                _context.Komentari.Remove(komentar);
            }

       
            _context.Clanci.Remove(clanak);

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<KomentarDomain> GetKomentarById(int id)
        {
            var komentar = await _context.Komentari.FindAsync(id);
            if (komentar == null)
            {
                return null;
            }

            return new KomentarDomain
            {
                Id = komentar.Id,
                ClanakId = komentar.ClanakId,
                CitateljId = komentar.CitateljId,
                Sadrzaj = komentar.Sadrzaj,
                Ocjena = komentar.Ocjena,
                DatumKreiranja = komentar.DatumKreiranja
            };
        }

        public async Task DeleteKomentar(int id)
        {
            var komentar = await _context.Komentari.FindAsync(id);
            if (komentar != null)
            {
                _context.Komentari.Remove(komentar);
                await _context.SaveChangesAsync();
            }
        }
      

        public async Task ObrisiKomentareKorisnika(string userId)
        {
            var komentari = _context.Komentari.Where(k => k.CitateljId == userId).ToList();
            _context.Komentari.RemoveRange(komentari);
            await _context.SaveChangesAsync();
        }

        public async Task<Osobe> GetOsobaByIdAsync(string userId)
        {
            return await _context.Osobe.FindAsync(userId);
        }

        public async Task DeleteUserCommentsAsync(string userId)
        {
            var komentari = _context.Komentari.Where(k => k.CitateljId == userId);
            _context.Komentari.RemoveRange(komentari);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteJournalistArticlesAsync(string userId)
        {
            var clanci = _context.Clanci.Where(c => c.NovinarId == userId).ToList();
            foreach (var clanak in clanci)
            {
                _context.Slike.RemoveRange(clanak.Slike);
                _context.Komentari.RemoveRange(clanak.Komentari);
            }
            _context.Clanci.RemoveRange(clanci);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAspNetUserAsync(string userId)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
            if (user != null)
            {
                _context.Users.Remove(user);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> DeleteProfileAsync(string userId)
        {
            await DeleteUserCommentsAsync(userId);
            await DeleteJournalistArticlesAsync(userId);
            await DeleteAspNetUserAsync(userId);

            var osoba = await GetOsobaByIdAsync(userId);
            if (osoba != null)
            {
                _context.Osobe.Remove(osoba);
                await _context.SaveChangesAsync();
                return true;
            }
            return false;
        }

        public async Task<bool> AzurirajOpisProfila(string id, string noviOpis)
        {
            var osoba = await _context.Osobe.FindAsync(id);
            if (osoba == null) return false;

            osoba.OpisProfila = noviOpis;
            await _context.SaveChangesAsync();
            return true;
        }



    }
}
