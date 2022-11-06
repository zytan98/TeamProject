using System;
using System.Collections.Generic;

#nullable disable

namespace ServerApi.Models
{
    public partial class CheckInOut
    {
        public int Id { get; set; }
        public DateTime? CheckInDate { get; set; }
        public DateTime? CheckOutDate { get; set; }
        public int? TotalHour { get; set; }
        public string CheckInOutcol { get; set; }
        public int BuildingId { get; set; }
        public int WorkerId { get; set; }
        public DateTime? CheckInTime { get; set; }
        public DateTime? CheckOutTime { get; set; }

        public virtual Building Building { get; set; }
        public virtual Worker Worker { get; set; }
    }
}
