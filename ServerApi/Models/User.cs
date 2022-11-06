using System;
using System.Collections.Generic;

#nullable disable

namespace ServerApi.Models
{
    public partial class User
    {
        public User()
        {
            Notifications = new HashSet<Notification>();
        }

        public int Id { get; set; }
        public string Name { get; set; }

        public virtual ICollection<Notification> Notifications { get; set; }
    }
}
