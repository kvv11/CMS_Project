using CMS.DAL.DataModel;
using CMS.Model;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CMS.Repository.Common
{
    public interface IRepository
    {
        IEnumerable<Osobe> PrikaziSveOsobe();
        void AddClanak(Clanci clanak);
        Task SaveChangesAsync();
        IEnumerable<Clanci> GetAllClanci();
        Clanci GetClanakById(int id);
        void AddKomentar(Komentari komentar);
        IEnumerable<Komentari> PrikaziKomentareZaClanak(int clanakId);
        Osobe PrikaziOsobuPoId(string id);
        Task UpdateClanakAsync(Clanci clanak);

        Task<bool> DeleteSlikaAsync(int clanakId, int slikaId);
        Task<bool> DeleteClanakAsync(int id);
        Task<KomentarDomain> GetKomentarById(int id);
        Task DeleteKomentar(int id);
        Task<Osobe> GetOsobaByIdAsync(string userId);
        Task DeleteUserCommentsAsync(string userId);
        Task DeleteJournalistArticlesAsync(string userId);
        Task DeleteAspNetUserAsync(string userId);
        Task<bool> DeleteProfileAsync(string userId);
        Task<bool> AzurirajOpisProfila(string id, string noviOpis);

    }
}
