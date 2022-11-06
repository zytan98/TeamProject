namespace ServerApi.Dtos
{
    public class CreateThresholdDto
    {
        public double upperthreshold { get; set; }
        public double lowerthreshold { get; set; }
        public string deveui { get; set; }
        public string type { get; set; }
    }
    public class UpdateThresholdDto
    {
        public double upperthreshold { get; set; }
        public double lowerthreshold { get; set; }
        public string deveui { get; set; }
        public string type { get; set; }
    }
}