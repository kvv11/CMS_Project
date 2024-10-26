using System;
using System.Collections.Generic;

namespace CMS.DAL.DataModel
{
    public partial class Citatelji
    {
        public Citatelji()
        {
            Komentari = new HashSet<Komentari>();
        }

        public string Id { get; set; }
        public int? BrojKomentara { get; set; }

        public virtual Osobe IdNavigation { get; set; }
        public virtual ICollection<Komentari> Komentari { get; set; }
    }
}
