using System;
using System.Collections.Generic;
using System.Text;

namespace CMS.Repository.AutoMapper
{
    public interface IRepositoryMappingService
    {
        TDestination Map<TDestination>(object source);
    }
}
