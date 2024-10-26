using CMS.Model;
using System.Collections.Generic;
using System;

public class ClanakDomain
{
    public int Id { get; set; }
    public string Naslov { get; set; }
    public string Sadrzaj { get; set; }
    public string Kategorija { get; set; }
    public string NovinarId { get; set; }
    public DateTime DatumKreiranja { get; set; } = DateTime.Now;
    public DateTime DatumIzmjene { get; set; } = DateTime.Now;
    public int Ocjena { get; set; }
    public List<SlikaDomain> Slike { get; set; }
}
