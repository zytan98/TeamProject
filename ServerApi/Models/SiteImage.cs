using System;
using System.Collections.Generic;

#nullable disable

namespace ServerApi.Models
{
    public partial class SiteImage
    {
        public SiteImage()
        {
            Worksites = new HashSet<Worksite>();
        }

        public int SiteImageId { get; set; }
        public byte[] SiteImage1 { get; set; }

        public virtual ICollection<Worksite> Worksites { get; set; }
    }
}
