using System;
using System.Collections.Generic;

#nullable disable

namespace ServerApi.Models
{
    public partial class Maintenance
    {
        public int Id { get; set; }
        public DateTime StartDate { get; set; }
        public string Responsible { get; set; }
        public string Remarks { get; set; }
        public bool Completed { get; set; }
        public int? Sensorid { get; set; }

        public virtual Sensor Sensor { get; set; }
    }
    public partial class MaintenanceDate
    {
        public int Id { get; set; }
        public DateTime StartDate { get; set; }
        public string Responsible { get; set; }
        public string Remarks { get; set; }
        public bool Completed { get; set; }
        public int? Sensorid { get; set; }
        public string Deveui { get; set; }

        public virtual Sensor Sensor { get; set; }

    }
}
