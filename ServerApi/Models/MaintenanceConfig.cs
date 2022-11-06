using System;
using System.Collections.Generic;

#nullable disable

namespace ServerApi.Models
{
    public partial class MaintenanceConfig
    {
        public int MaintenanceConfigId { get; set; }
        public string MaintenanceConfigDescription { get; set; }
        public string MaintenanceConfigValue { get; set; }
        public int WorksiteId { get; set; }

        public virtual Worksite Worksite { get; set; }
    }
}
