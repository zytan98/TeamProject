using System;
using System.Collections.Generic;

#nullable disable

namespace ServerApi.Models
{
    public partial class ShapePoint
    {
        public int ShapePointsId { get; set; }
        public int BuildingId { get; set; }
        public int XPoint { get; set; }
        public int YPoint { get; set; }

        public virtual Building Building { get; set; }
    }
}
