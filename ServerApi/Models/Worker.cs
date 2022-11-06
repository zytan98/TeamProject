using System;
using System.Collections.Generic;

#nullable disable

namespace ServerApi.Models
{
    public partial class Worker
    {
        public Worker()
        {
            CheckInOuts = new HashSet<CheckInOut>();
        }

        public int Id { get; set; }
        public string UserId { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string Wid { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public byte[] Photo { get; set; }
        public int? CompanyId { get; set; }

        public virtual Company Company { get; set; }
        public virtual ICollection<CheckInOut> CheckInOuts { get; set; }
    }
    public partial class WorkerCheckInOut
    {
        public int Id { get; set; }

        public string Name { get; set; }
        public string PhoneNumber { get; set; }

        public DateTime? CheckInDate { get; set; }
        public DateTime? CheckInTime { get; set; }
        public DateTime? CheckOutDate { get; set; }
        public DateTime? CheckOutTime { get; set; }
        public int BuildingId { get; set; }
        public string CompanyName { get; set; }
    }
}
