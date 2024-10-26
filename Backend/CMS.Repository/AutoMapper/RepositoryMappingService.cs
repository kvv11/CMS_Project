using AutoMapper;
using CMS.DAL.DataModel;
using CMS.Model;

namespace CMS.Repository.AutoMapper
{
    public class RepositoryMappingService : IRepositoryMappingService
    {
        private readonly IMapper mapper;

        public RepositoryMappingService()
        {
            var config = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<Osobe, OsobaDomain>();
                cfg.CreateMap<OsobaDomain, Osobe>();

                cfg.CreateMap<Citatelji, CitateljDomain>();
                cfg.CreateMap<CitateljDomain, Citatelji>();

                cfg.CreateMap<Novinari, NovinarDomain>();
                cfg.CreateMap<NovinarDomain, Novinari>();

                cfg.CreateMap<Clanci, ClanakDomain>()
                    .ForMember(dest => dest.Slike, opt => opt.MapFrom(src => src.Slike));
                cfg.CreateMap<ClanakDomain, Clanci>()
                    .ForMember(dest => dest.Slike, opt => opt.MapFrom(src => src.Slike));

                cfg.CreateMap<Komentari, KomentarDomain>();
                cfg.CreateMap<KomentarDomain, Komentari>();

                cfg.CreateMap<Slike, SlikaDomain>();
                cfg.CreateMap<SlikaDomain, Slike>();
            });

            mapper = config.CreateMapper();
        }

        public TDestination Map<TDestination>(object source)
        {
            return mapper.Map<TDestination>(source);
        }
    }
}
