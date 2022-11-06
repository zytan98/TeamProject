using System;
using System.Collections.Generic;

#nullable disable

namespace ServerApi.Models
{
    public partial class SensorConfiguration
    {
        public int SensorConfigurationsId { get; set; }
        public int Display { get; set; }
        public int WorksiteId { get; set; }
        public int Typeid { get; set; }

        public virtual SensorType Type { get; set; }
        public virtual Worksite Worksite { get; set; }
    }

    public partial class SensorConfigurationJoinSensorType
    {
        public int SensorConfigurationsId { get; set; }
        public int WorksiteId { get; set; }
        public int Typeid { get; set; }
        public int Display { get; set; }
        public string Description { get; set; }

    }
}
