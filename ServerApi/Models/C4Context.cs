using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

#nullable disable

namespace ServerApi.Models
{
    public partial class C4Context : DbContext
    {
        public C4Context()
        {
        }

        public C4Context(DbContextOptions<C4Context> options)
            : base(options)
        {
        }

        public virtual DbSet<Building> Buildings { get; set; }
        public virtual DbSet<CheckInOut> CheckInOuts { get; set; }
        public virtual DbSet<Company> Companies { get; set; }
        public virtual DbSet<Controlling> Controllings { get; set; }
        public virtual DbSet<Level> Levels { get; set; }
        public virtual DbSet<Maintenance> Maintenances { get; set; }
        public virtual DbSet<MaintenanceConfig> MaintenanceConfigs { get; set; }
        public virtual DbSet<Sensor> Sensors { get; set; }
        public virtual DbSet<SensorDatum> SensorData { get; set; }
        public virtual DbSet<SensorType> SensorTypes { get; set; }
        public virtual DbSet<ShapePoint> ShapePoints { get; set; }
        public virtual DbSet<SiteImage> SiteImages { get; set; }
        public virtual DbSet<Threshold> Thresholds { get; set; }
        public virtual DbSet<Worker> Workers { get; set; }
        public virtual DbSet<Worksite> Worksites { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
                optionsBuilder.UseNpgsql("Host=174.138.23.75;Port=5432;Database=C4;Username=postgres;Password=cl0udplus!");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasAnnotation("Relational:Collation", "C.UTF-8");

            modelBuilder.Entity<Building>(entity =>
            {
                entity.ToTable("Building");

                entity.Property(e => e.BuildingId).HasColumnName("buildingID");

                entity.Property(e => e.BuildingName)
                    .HasColumnType("character varying")
                    .HasColumnName("building_name");

                entity.Property(e => e.Restricted).HasColumnName("restricted");

                entity.Property(e => e.WorksiteId).HasColumnName("worksite_ID");

                entity.HasOne(d => d.Worksite)
                    .WithMany(p => p.Buildings)
                    .HasForeignKey(d => d.WorksiteId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("worksiteID");
            });

            modelBuilder.Entity<CheckInOut>(entity =>
            {
                entity.ToTable("Check_in_out");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.BuildingId).HasColumnName("buildingID");

                entity.Property(e => e.CheckInDate).HasColumnName("check_in_date");

                entity.Property(e => e.CheckInOutcol)
                    .HasMaxLength(45)
                    .HasColumnName("Check_in_outcol");

                entity.Property(e => e.CheckInTime).HasColumnName("check_in_time");

                entity.Property(e => e.CheckOutDate).HasColumnName("check_out_date");

                entity.Property(e => e.CheckOutTime).HasColumnName("check_out_time");

                entity.Property(e => e.TotalHour).HasColumnName("total_hour");

                entity.Property(e => e.WorkerId).HasColumnName("worker_id");

                entity.HasOne(d => d.Building)
                    .WithMany(p => p.CheckInOuts)
                    .HasForeignKey(d => d.BuildingId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("buildingID");

                entity.HasOne(d => d.Worker)
                    .WithMany(p => p.CheckInOuts)
                    .HasForeignKey(d => d.WorkerId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("worker_id");
            });

            modelBuilder.Entity<Company>(entity =>
            {
                entity.ToTable("Company");

                entity.Property(e => e.Id)
                    .ValueGeneratedNever()
                    .HasColumnName("id");

                entity.Property(e => e.BcaApprove).HasColumnName("bca_approve");

                entity.Property(e => e.BlkNo)
                    .HasColumnType("character varying")
                    .HasColumnName("blk_no");

                entity.Property(e => e.BuildingName)
                    .HasColumnType("character varying")
                    .HasColumnName("building_name");

                entity.Property(e => e.BuildingNo)
                    .HasColumnType("character varying")
                    .HasColumnName("building_no");

                entity.Property(e => e.CompanyName)
                    .HasColumnType("character varying")
                    .HasColumnName("company_name");

                entity.Property(e => e.CompanyNumber)
                    .HasColumnType("character varying")
                    .HasColumnName("company_number");

                entity.Property(e => e.DebarredLast3Yrs).HasColumnName("debarred_last_3_yrs");

                entity.Property(e => e.FloorNo)
                    .HasColumnType("character varying")
                    .HasColumnName("floor_no");

                entity.Property(e => e.PostalCode)
                    .HasColumnType("character varying")
                    .HasColumnName("postal_code");
            });

            modelBuilder.Entity<Controlling>(entity =>
            {
                entity.ToTable("Controlling");

                entity.Property(e => e.Id)
                    .HasColumnName("id")
                    .HasIdentityOptions(null, null, null, 2147483647L, null, null);

                entity.Property(e => e.Action)
                    .IsRequired()
                    .HasColumnType("character varying")
                    .HasColumnName("action");

                entity.Property(e => e.Sensorid).HasColumnName("sensorid");

                entity.Property(e => e.Time).HasColumnName("time");

                entity.HasOne(d => d.Sensor)
                    .WithMany(p => p.Controllings)
                    .HasForeignKey(d => d.Sensorid)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("sensorid");
            });

            modelBuilder.Entity<Level>(entity =>
            {
                entity.ToTable("Level");

                entity.Property(e => e.Levelid).HasColumnName("levelid");

                entity.Property(e => e.BuildingId).HasColumnName("buildingID");

                entity.Property(e => e.BuildingLevel).HasColumnName("building_level");

                entity.HasOne(d => d.Building)
                    .WithMany(p => p.Levels)
                    .HasForeignKey(d => d.BuildingId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("buildingID");
            });

            modelBuilder.Entity<Maintenance>(entity =>
            {
                entity.ToTable("Maintenance");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.Completed).HasColumnName("completed");

                entity.Property(e => e.Remarks)
                    .HasMaxLength(45)
                    .HasColumnName("remarks");

                entity.Property(e => e.Responsible)
                    .IsRequired()
                    .HasMaxLength(45)
                    .HasColumnName("responsible");

                entity.Property(e => e.Sensorid).HasColumnName("sensorid");

                entity.Property(e => e.StartDate)
                    .HasColumnType("date")
                    .HasColumnName("startDate");

                entity.HasOne(d => d.Sensor)
                    .WithMany(p => p.Maintenances)
                    .HasForeignKey(d => d.Sensorid)
                    .HasConstraintName("sensorid");
            });

            modelBuilder.Entity<MaintenanceConfig>(entity =>
            {
                entity.ToTable("MaintenanceConfig");

                entity.Property(e => e.MaintenanceConfigId).HasColumnName("maintenance_config_id");

                entity.Property(e => e.MaintenanceConfigDescription)
                    .HasMaxLength(45)
                    .HasColumnName("maintenance_config_description");

                entity.Property(e => e.MaintenanceConfigValue)
                    .HasMaxLength(45)
                    .HasColumnName("maintenance_config_value");

                entity.Property(e => e.WorksiteId).HasColumnName("worksite_id");

                entity.HasOne(d => d.Worksite)
                    .WithMany(p => p.MaintenanceConfigs)
                    .HasForeignKey(d => d.WorksiteId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("worksite_id");
            });

            modelBuilder.Entity<Sensor>(entity =>
            {
                entity.ToTable("Sensor");

                entity.Property(e => e.Sensorid).HasColumnName("sensorid");

                entity.Property(e => e.Deveui)
                    .IsRequired()
                    .HasColumnType("character varying")
                    .HasColumnName("deveui");

                entity.Property(e => e.Levelid).HasColumnName("levelid");

                entity.Property(e => e.Location)
                    .IsRequired()
                    .HasColumnType("character varying")
                    .HasColumnName("location");

                entity.HasOne(d => d.Level)
                    .WithMany(p => p.Sensors)
                    .HasForeignKey(d => d.Levelid)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("levelid");
            });

            modelBuilder.Entity<SensorDatum>(entity =>
            {
                entity.HasKey(e => e.Readingid)
                    .HasName("Sensor_data_pkey");

                entity.Property(e => e.Readingid)
                    .HasColumnName("readingid")
                    .HasIdentityOptions(null, null, null, 2147483647L, null, null);

                entity.Property(e => e.Sensorid).HasColumnName("sensorid");

                entity.Property(e => e.Time)
                    .HasColumnType("timestamp with time zone")
                    .HasColumnName("time");

                entity.Property(e => e.Type)
                    .HasMaxLength(20)
                    .HasColumnName("type");

                entity.Property(e => e.Typeid).HasColumnName("typeid");

                entity.Property(e => e.Value).HasColumnName("value");

                entity.HasOne(d => d.Sensor)
                    .WithMany(p => p.SensorData)
                    .HasForeignKey(d => d.Sensorid)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("sensorid");

                entity.HasOne(d => d.TypeNavigation)
                    .WithMany(p => p.SensorData)
                    .HasForeignKey(d => d.Typeid)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("typeid");
            });

            modelBuilder.Entity<SensorType>(entity =>
            {
                entity.HasKey(e => e.Typeid)
                    .HasName("sensor_type_pkey");

                entity.ToTable("SensorType");

                entity.Property(e => e.Typeid).HasColumnName("typeid");

                entity.Property(e => e.Description)
                    .HasColumnType("character varying")
                    .HasColumnName("description");

                entity.Property(e => e.Display).HasColumnName("display");

                entity.Property(e => e.Format)
                    .IsRequired()
                    .HasColumnType("character varying")
                    .HasColumnName("format");

                entity.Property(e => e.Type)
                    .IsRequired()
                    .HasColumnType("character varying")
                    .HasColumnName("type");

                entity.Property(e => e.WorksiteId).HasColumnName("worksite_id");
            });

            modelBuilder.Entity<ShapePoint>(entity =>
            {
                entity.HasKey(e => e.ShapePointsId)
                    .HasName("shapePoints_pkey");

                entity.Property(e => e.ShapePointsId).HasColumnName("shapePointsID");

                entity.Property(e => e.BuildingId).HasColumnName("buildingID");

                entity.Property(e => e.XPoint).HasColumnName("xPoint");

                entity.Property(e => e.YPoint).HasColumnName("yPoint");

                entity.HasOne(d => d.Building)
                    .WithMany(p => p.ShapePoints)
                    .HasForeignKey(d => d.BuildingId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("buildingID");
            });

            modelBuilder.Entity<SiteImage>(entity =>
            {
                entity.ToTable("Site_image");

                entity.Property(e => e.SiteImageId).HasColumnName("siteImageID");

                entity.Property(e => e.SiteImage1).HasColumnName("siteImage");
            });

            modelBuilder.Entity<Threshold>(entity =>
            {
                entity.ToTable("Threshold");

                entity.Property(e => e.Thresholdid)
                    .ValueGeneratedNever()
                    .HasColumnName("thresholdid");

                entity.Property(e => e.Lowerthreshold).HasColumnName("lowerthreshold");

                entity.Property(e => e.Sensorid).HasColumnName("sensorid");

                entity.Property(e => e.Typeid).HasColumnName("typeid");

                entity.Property(e => e.Upperthreshold).HasColumnName("upperthreshold");

                entity.HasOne(d => d.Sensor)
                    .WithMany(p => p.Thresholds)
                    .HasForeignKey(d => d.Sensorid)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("sensorid");

                entity.HasOne(d => d.Type)
                    .WithMany(p => p.Thresholds)
                    .HasForeignKey(d => d.Typeid)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("typeid");
            });

            modelBuilder.Entity<Worker>(entity =>
            {
                entity.ToTable("Worker");

                entity.Property(e => e.Id).HasColumnName("id");

                entity.Property(e => e.CompanyId).HasColumnName("company_id");

                entity.Property(e => e.Email)
                    .HasMaxLength(45)
                    .HasColumnName("email");

                entity.Property(e => e.Name)
                    .HasMaxLength(45)
                    .HasColumnName("name");

                entity.Property(e => e.Password)
                    .HasMaxLength(45)
                    .HasColumnName("password");

                entity.Property(e => e.PhoneNumber)
                    .HasMaxLength(45)
                    .HasColumnName("phone_number");

                entity.Property(e => e.Photo).HasColumnName("photo");

                entity.Property(e => e.UserId)
                    .HasMaxLength(45)
                    .HasColumnName("user_id");

                entity.Property(e => e.Username)
                    .HasMaxLength(45)
                    .HasColumnName("username");

                entity.Property(e => e.Wid)
                    .HasMaxLength(45)
                    .HasColumnName("WID");

                entity.HasOne(d => d.Company)
                    .WithMany(p => p.Workers)
                    .HasForeignKey(d => d.CompanyId)
                    .HasConstraintName("company_id");
            });

            modelBuilder.Entity<Worksite>(entity =>
            {
                entity.ToTable("Worksite");

                entity.Property(e => e.WorksiteId).HasColumnName("worksite_id");

                entity.Property(e => e.Location)
                    .IsRequired()
                    .HasColumnType("character varying")
                    .HasColumnName("location");

                entity.Property(e => e.SiteImageId).HasColumnName("siteImageID");

                entity.Property(e => e.WorksiteName)
                    .HasColumnType("character varying")
                    .HasColumnName("worksite_name");

                entity.HasOne(d => d.SiteImage)
                    .WithMany(p => p.Worksites)
                    .HasForeignKey(d => d.SiteImageId)
                    .HasConstraintName("siteImageID");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
