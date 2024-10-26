using CMS.Model;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace CMS.Service.Common
{
    public interface IService
    {
        IEnumerable<OsobaDomain> PrikaziSveOsobe();
        Task AddClanak(ClanakDomain clanak);
        IEnumerable<ClanakDomain> GetAllClanci();
        ClanakDomain GetClanakById(int id);
        Task AddKomentar(KomentarDomain komentar);
        IEnumerable<KomentarDomain> PrikaziKomentareZaClanak(int clanakId);
        OsobaDomain PrikaziOsobuPoId(string id);
        Task UpdateClanakAsync(ClanakDomain updatedClanak);

        Task<bool> DeleteSlikaAsync(int clanakId, int slikaId);

        Task<bool> DeleteClanakAsync(int id);
        Task<KomentarDomain> GetKomentarById(int id);
        Task DeleteKomentar(int id);
        Task<OsobaDomain> GetOsobaByIdAsync(string userId);
        Task<bool> DeleteProfileAsync(string userId);
        Task<bool> AzurirajOpisProfila(string id, string noviOpis);



    }
}
