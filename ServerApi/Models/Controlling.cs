using System;
using System.Collections.Generic;

#nullable disable

namespace ServerApi.Models
{
    public partial class Controlling
    {
        public long Id { get; set; }
        public DateTime Time { get; set; }
        public string Action { get; set; }
        public int Sensorid { get; set; }

        public virtual Sensor Sensor { get; set; }
    }
}
