using System;
using System.Collections.Generic;

#nullable disable

namespace ServerApi.Models
{
    public partial class SensorDatum
    {
        public long Readingid { get; set; }
        public DateTime Time { get; set; }
        public int Sensorid { get; set; }
        public double Value { get; set; }
        public int Typeid { get; set; }
        public string Type { get; set; }

        public virtual Sensor Sensor { get; set; }
        public virtual SensorType TypeNavigation { get; set; }
    }
    public partial class SensorDatumAverage
    {
        public double Value { get; set; }
        public int Typeid { get; set; }
    }
}
