using System;
using System.Collections.Generic;

#nullable disable

namespace ServerApi.Models
{
    public partial class SensorType
    {
        public SensorType()
        {
            SensorData = new HashSet<SensorDatum>();
            Thresholds = new HashSet<Threshold>();
        }

        public string Format { get; set; }
        public string Type { get; set; }
        public string Description { get; set; }
        public int Typeid { get; set; }
        public int WorksiteId { get; set; }
        public int? Display { get; set; }

        public virtual ICollection<SensorDatum> SensorData { get; set; }
        public virtual ICollection<Threshold> Thresholds { get; set; }
    }
}
