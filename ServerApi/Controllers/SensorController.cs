using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ServerApi.Models;
using ServerApi.Dtos;

namespace ServerApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SensorController : ControllerBase
    {
        private readonly C4Context _context;

        public SensorController(C4Context context)
        {
            _context = context;
        }

        // GET: api/Sensor
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Sensor>>> GetSensors()
        {
            return await _context.Sensors.ToListAsync();
        }

        // GET: api/Sensor/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Sensor>> GetSensor(int id)
        {
            var sensor = await _context.Sensors.FindAsync(id);

            if (sensor == null)
            {
                return NotFound();
            }

            return sensor;
        }
        [HttpGet("check/{deveui}")]
        public async Task<ActionResult<Sensor>> GetSensorExist(String deveui)
        {
            var sensor = await _context.Sensors.Where(x => x.Deveui == deveui).FirstOrDefaultAsync();

            if (sensor == null)
            {
                return NotFound();
            }

            return sensor;
        }
        [HttpGet("checkProject/{levelid}/{worksiteid}")]
        public async Task<ActionResult<Sensor>> GetSensorExistInProject(int levelid, int worksiteid)
        {
            var query = from s in _context.Sensors
                        join l in _context.Levels
                        on s.Levelid equals l.Levelid
                        join b in _context.Buildings
                        on l.BuildingId equals b.BuildingId
                        join ws in _context.Worksites
                        on b.WorksiteId equals ws.WorksiteId
                        where s.Levelid == levelid
                        where ws.WorksiteId == worksiteid
                        select new Sensor { };

            var sensor = await query.FirstOrDefaultAsync();

            if (sensor == null)
            {
                return NotFound();
            }

            return sensor;
        }
        [HttpGet("checksensors/{worksiteid}")]
        public async Task<ActionResult<IEnumerable<SensorTable>>> GetSensorsInProject(int worksiteid)
        {
            var query = from s in _context.Sensors
                        join l in _context.Levels
                        on s.Levelid equals l.Levelid
                        join b in _context.Buildings
                        on l.BuildingId equals b.BuildingId
                        where b.WorksiteId == worksiteid
                        select new SensorTable { Deveui = s.Deveui, BuildingName = b.BuildingName, BuildingLevel = l.BuildingLevel, Sensorid = s.Sensorid };

            var sensorList = await query.ToListAsync();

            if (sensorList == null)
            {
                return NotFound();
            }
            foreach (var sensor in sensorList)
            {
                var stringTemp = "";
                var result = await (from s in _context.Sensors
                                    join t in _context.Thresholds
                                    on s.Sensorid equals t.Sensorid
                                    join st in _context.SensorTypes
                                    on t.Typeid equals st.Typeid
                                    where s.Sensorid == sensor.Sensorid
                                    select new
                                    {
                                        Type = st.Type
                                    }).ToListAsync();
                if (result != null)
                {
                    foreach (var type in result)
                    {
                        stringTemp += type.Type + ", ";
                    }
                    if (stringTemp.Length > 0)
                    {

                        stringTemp = stringTemp.Substring(0, stringTemp.Length - 2);
                    }
                    sensor.SensorTypeString = stringTemp;
                }
            }
            return sensorList;
        }
        [HttpGet("checksensorsbuilding/{BuildingId}")]
        public async Task<ActionResult<IEnumerable<SensorTable>>> GetSensorsInProjectBuilding(int BuildingId)
        {
            var query = from s in _context.Sensors
                        join l in _context.Levels
                        on s.Levelid equals l.Levelid
                        join b in _context.Buildings
                        on l.BuildingId equals b.BuildingId
                        where b.BuildingId == BuildingId
                        select new SensorTable { Deveui = s.Deveui, BuildingName = b.BuildingName, BuildingLevel = l.BuildingLevel, Sensorid = s.Sensorid };

            var sensorList = await query.ToListAsync();

            if (sensorList == null)
            {
                return NotFound();
            }
            foreach (var sensor in sensorList)
            {
                var stringTemp = "";
                var result = await (from s in _context.Sensors
                                    join t in _context.Thresholds
                                    on s.Sensorid equals t.Sensorid
                                    join st in _context.SensorTypes
                                    on t.Typeid equals st.Typeid
                                    where s.Sensorid == sensor.Sensorid
                                    select new
                                    {
                                        Type = st.Type
                                    }).ToListAsync();
                foreach (var type in result)
                {
                    stringTemp += type.Type + ", ";
                }
                if (stringTemp.Length > 0)
                {

                    stringTemp = stringTemp.Substring(0, stringTemp.Length - 2);
                }
                if (result != null)
                {
                    sensor.SensorTypeString = stringTemp;
                }
            }
            return sensorList;
        }

        // PUT: api/Sensor/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSensor(int id, Sensor sensor)
        {
            if (id != sensor.Sensorid)
            {
                return BadRequest();
            }

            _context.Entry(sensor).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SensorExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Sensor
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Sensor>> PostSensor(Sensor sensor)
        {
            _context.Sensors.Add(sensor);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetSensor", new { id = sensor.Sensorid }, sensor);
        }

        // DELETE: api/Sensor/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSensor(int id)
        {
            var sensor = await _context.Sensors.FindAsync(id);
            if (sensor == null)
            {
                return NotFound();
            }

            _context.Sensors.Remove(sensor);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool SensorExists(int id)
        {
            return _context.Sensors.Any(e => e.Sensorid == id);
        }

         //----------------------------------------------//
        //--------------------Sensor--------------------//
        //----------------------------------------------//
        /// <summary>
        /// Creates Sensor from parameters provided
        /// </summary>
        /// <remarks>
        /// 
        /// levelid is levelid from level table
        /// 
        /// </remarks>
        [HttpPost("sensor")]
        public async Task<ActionResult> CreateSensor(CreateSensorDto createSensorDto)
        {
            Sensor sensor = new()
            {
                Deveui = createSensorDto.deveui,
                Location = createSensorDto.location,
                Levelid = createSensorDto.levelid,
            };
            _context.Sensors.Add(sensor);
            await _context.SaveChangesAsync();
            return Ok();
        }
        /// <summary>
        /// Delete Sensor by deveui
        /// </summary>
        [HttpDelete("sensor/{deveui}")]
        public async Task<ActionResult> DeleteSensor(string deveui)
        {
            var item = await _context.Sensors.Where(t => t.Deveui == deveui).ToListAsync();
            if (item == null)
                return NotFound();
            var itemToDelete = item.First();
            if (itemToDelete == null)
                throw new NullReferenceException();
            _context.Sensors.Remove(itemToDelete);
            await _context.SaveChangesAsync();
            return Ok();
        }
        /// <summary>
        /// Retrieves all Sensor
        /// </summary>
        [HttpGet("sensor/all")]
        public async Task<ActionResult<IEnumerable<Sensor>>> GetAllSensors()
        {
            var sensors = await _context.Sensors.ToListAsync();
            return Ok(sensors);
        }
        /// <summary>
        /// Update Sensor by deveui and parameters provided
        /// </summary>
        [HttpPut("sensor/{deveui}")]
        public async Task<ActionResult> UpdateSensor(string deveui, UpdateSensorDto updateSensorDto)
        {
            Sensor sensor = new()
            {
                Deveui = deveui,
                Location = updateSensorDto.location,
                Levelid = updateSensorDto.levelid,
            };
            var item = await _context.Sensors.Where(t => t.Deveui == sensor.Deveui).ToListAsync();
            var itemToUpdate = item.First();
            if (itemToUpdate == null)
                return NotFound();
            itemToUpdate.Location = sensor.Location;
            itemToUpdate.Levelid = sensor.Levelid;
            await _context.SaveChangesAsync();
            return Ok();
        }

        /// <summary>
        /// Retrieves Sensor by deveui
        /// </summary>
        [HttpGet("sensor/filter/deveui")]
        public async Task<ActionResult<IEnumerable<Sensor>>> GetSensorByDeveui(string deveui)
        {
            var sensor = await _context.Sensors.Where(t => t.Deveui == deveui).ToListAsync();
            if (sensor == null)
                return NotFound();
            return Ok(sensor);
        }

        /// <summary>
        /// Retrieves Sensor by location
        /// </summary>
        [HttpGet("sensor/filter/location")]
        public async Task<ActionResult<IEnumerable<Sensor>>> GetSensorByLocation(string location)
        {
            var sensor = await _context.Sensors.Where(t => t.Location == location).ToListAsync();
            if (sensor == null)
                return NotFound();
            return Ok(sensor);
        }

        /// <summary>
        /// Retrieves Sensor by levelid
        /// </summary>
        /// <remarks>
        /// 
        /// levelid is levelid from level table
        /// 
        /// </remarks>
        [HttpGet("sensor/filter/levelid")]
        public async Task<ActionResult<IEnumerable<Sensor>>> GetSensorByLevelID(int levelid)
        {
            var sensor = await _context.Sensors.Where(t => t.Levelid == levelid).ToListAsync();
            if (sensor == null)
                return NotFound();
            return Ok(sensor);
        }
    
    }
}
