using System;
using System.Collections.Generic;

#nullable disable

namespace ServerApi.Models
{
    public partial class Building
    {
        public Building()
        {
            CheckInOuts = new HashSet<CheckInOut>();
            Levels = new HashSet<Level>();
            ShapePoints = new HashSet<ShapePoint>();
        }

        public int BuildingId { get; set; }
        public int WorksiteId { get; set; }
        public bool? Restricted { get; set; }
        public string BuildingName { get; set; }

        public virtual Worksite Worksite { get; set; }
        public virtual ICollection<CheckInOut> CheckInOuts { get; set; }
        public virtual ICollection<Level> Levels { get; set; }
        public virtual ICollection<ShapePoint> ShapePoints { get; set; }
    }
}
