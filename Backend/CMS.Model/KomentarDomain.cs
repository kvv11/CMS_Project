using System;
using System.Collections.Generic;
using System.Text;

namespace CMS.Model
{
    public class KomentarDomain
    {
        public int Id { get; set; }
        public string CitateljId { get; set; }
        public int ClanakId { get; set; }
        public string Sadrzaj { get; set; }
        public int Ocjena { get; set; }
        public DateTime DatumKreiranja { get; set; }
    }
}
