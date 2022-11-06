using System;
using System.Collections.Generic;

#nullable disable

namespace ServerApi.Models
{
    public partial class Level
    {
        public Level()
        {
            Sensors = new HashSet<Sensor>();
        }

        public int Levelid { get; set; }
        public int BuildingId { get; set; }
        public int? BuildingLevel { get; set; }

        public virtual Building Building { get; set; }
        public virtual ICollection<Sensor> Sensors { get; set; }
    }
    public partial class LevelSensor
    {
        public int Levelid { get; set; }
        public int? BuildingLevel { get; set; }
        public string BuildingName { get; set; }

    }
}
