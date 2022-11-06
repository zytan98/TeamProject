using System;
using System.Collections.Generic;

#nullable disable

namespace ServerApi.Models
{
    public partial class Sensor
    {
        public Sensor()
        {
            Controllings = new HashSet<Controlling>();
            Maintenances = new HashSet<Maintenance>();
            SensorData = new HashSet<SensorDatum>();
            Thresholds = new HashSet<Threshold>();
        }
        public string Location { get; set; }
        public int Sensorid { get; set; }
        public string Deveui { get; set; }
        public int Levelid { get; set; }

        public virtual Level Level { get; set; }
        public virtual ICollection<Controlling> Controllings { get; set; }
        public virtual ICollection<Maintenance> Maintenances { get; set; }
        public virtual ICollection<SensorDatum> SensorData { get; set; }
        public virtual ICollection<Threshold> Thresholds { get; set; }
    }

    public partial class SensorTypeMinor
    {
        public string Type { get; set; }
        public int Typeid { get; set; }
    }
    public partial class SensorTable
    {
        public int Sensorid { get; set; }
        public string BuildingName { get; set; }
        public string Deveui { get; set; }


        public int? BuildingLevel { get; set; }
        public string SensorTypeString { get; set; }

    }
}
