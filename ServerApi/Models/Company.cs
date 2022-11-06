using System;
using System.Collections.Generic;

#nullable disable

namespace ServerApi.Models
{
    public partial class Company
    {
        public Company()
        {
            Workers = new HashSet<Worker>();
        }

        public int Id { get; set; }
        public string CompanyNumber { get; set; }
        public string CompanyName { get; set; }
        public string PostalCode { get; set; }
        public string BlkNo { get; set; }
        public string FloorNo { get; set; }
        public string BuildingName { get; set; }
        public string BuildingNo { get; set; }
        public bool? BcaApprove { get; set; }
        public bool? DebarredLast3Yrs { get; set; }

        public virtual ICollection<Worker> Workers { get; set; }
    }
}
