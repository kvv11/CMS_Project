using System;
using System.Collections.Generic;
using System.Text;

namespace CMS.Model
{
    public class OsobaDomain
    {
        public string Id { get; set; }
        public string Ime { get; set; }
        public string Prezime { get; set; }
        public string Email { get; set; }
        public string Lozinka { get; set; }
        public DateTime DatumRegistracije { get; set; }
        public string OpisProfila { get; set; }
        public string Uloga { get; set; }
    }
}
