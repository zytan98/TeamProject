using System;
using System.Collections.Generic;

#nullable disable

namespace ServerApi.Models
{
    public partial class Worksite
    {
        public Worksite()
        {
            Buildings = new HashSet<Building>();
            MaintenanceConfigs = new HashSet<MaintenanceConfig>();
        }

        public int WorksiteId { get; set; }
        public string WorksiteName { get; set; }
        public string Location { get; set; }
        public int? SiteImageId { get; set; }

        public virtual SiteImage SiteImage { get; set; }
        public virtual ICollection<Building> Buildings { get; set; }
        public virtual ICollection<MaintenanceConfig> MaintenanceConfigs { get; set; }
    }
}
