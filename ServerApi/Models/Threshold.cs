using System;
using System.Collections.Generic;

#nullable disable

namespace ServerApi.Models
{
    public partial class Threshold
    {
        public int Thresholdid { get; set; }
        public double? Upperthreshold { get; set; }
        public double? Lowerthreshold { get; set; }
        public int Typeid { get; set; }
        public int Sensorid { get; set; }

        public virtual Sensor Sensor { get; set; }
        public virtual SensorType Type { get; set; }
    }

    public partial class ThresholdWithSensorTypeDescription
    {

        public string Deveui { get; set; }
        public int Thresholdid { get; set; }
        public double? Upperthreshold { get; set; }
        public double? Lowerthreshold { get; set; }
        public int Typeid { get; set; }
        public int Sensorid { get; set; }


        public string TypeDescription { get; set; }
    }

}
