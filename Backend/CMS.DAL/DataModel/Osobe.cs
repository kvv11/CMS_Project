using System;
using System.Collections.Generic;

namespace CMS.DAL.DataModel
{
    public partial class Osobe
    {
        public Osobe()
        {
            Komentari = new HashSet<Komentari>();
        }

        public string Id { get; set; }
        public string Ime { get; set; }
        public string Prezime { get; set; }
        public string Email { get; set; }
        public string Lozinka { get; set; }
        public DateTime? DatumRegistracije { get; set; }
        public string OpisProfila { get; set; }
        public string Uloga { get; set; }

        public virtual Citatelji Citatelji { get; set; }
        public virtual Novinari Novinari { get; set; }
        public virtual ICollection<Komentari> Komentari { get; set; }
    }
}
