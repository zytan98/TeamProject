namespace ServerApi.Dtos
{
    public class CreateSensorTypeDto
    {
        public string type { get; set; }
        public string description { get; set; }
        public string format { get; set; }
        public int worksite_id { get; set; }
    }
    public class UpdateSensorTypeDto
    {
        public string description { get; set; }
        public string format { get; set; }
        public int worksite_id { get; set; }
    }
}