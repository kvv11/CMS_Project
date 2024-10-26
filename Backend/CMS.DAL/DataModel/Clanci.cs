using System;
using System.Collections.Generic;

namespace CMS.DAL.DataModel
{
    public partial class Clanci
    {
        public Clanci()
        {
            Komentari = new HashSet<Komentari>();
            Slike = new HashSet<Slike>();
        }

        public int Id { get; set; }
        public string Naslov { get; set; }
        public string Sadrzaj { get; set; }
        public string Kategorija { get; set; }
        public string NovinarId { get; set; }
        public DateTime DatumKreiranja { get; set; }
        public DateTime DatumIzmjene { get; set; }
        public int Ocjena { get; set; }

        public virtual Novinari Novinar { get; set; }
        public virtual ICollection<Komentari> Komentari { get; set; }
        public virtual ICollection<Slike> Slike { get; set; }
    }
}
