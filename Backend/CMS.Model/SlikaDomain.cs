using System;
using System.Collections.Generic;
using System.Text;

namespace CMS.Model
{
    public class SlikaDomain
    {
        public int Id { get; set; }
        public int ClanakId { get; set; }
        public byte[] Slika { get; set; }
        public string SlikaString { get; set; }
    }

}
