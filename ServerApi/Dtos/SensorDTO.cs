namespace ServerApi.Dtos
{
     public class CreateSensorDto
    {
        public string deveui { get; set; }
        public string location { get; set; }
        public int levelid { get; set; }
    }
    public class UpdateSensorDto
    {
        public string location { get; set; }
        public int levelid { get; set; }
    }
}