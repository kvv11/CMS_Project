using System;
using System.Collections.Generic;
using System.Text;

namespace CMS.DAL.DataModel
{
    public class Slike
    {
        public int Id { get; set; }
        public int ClanakId { get; set; }
        public byte[] Slika { get; set; }

        public virtual Clanci Clanak { get; set; }
    }
}
