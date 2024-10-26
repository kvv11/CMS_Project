using System;
using System.Collections.Generic;

namespace CMS.DAL.DataModel
{
    public partial class Novinari
    {
        public Novinari()
        {
            Clanci = new HashSet<Clanci>();
        }

        public string Id { get; set; }
        public int? BrojClanaka { get; set; }

        public virtual Osobe IdNavigation { get; set; }
        public virtual ICollection<Clanci> Clanci { get; set; }
    }
}
