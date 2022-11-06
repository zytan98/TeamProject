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
    public class ThresholdController : ControllerBase
    {
        private readonly C4Context _context;

        public ThresholdController(C4Context context)
        {
            _context = context;
        }

        // GET: api/Threshold
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Threshold>>> GetThresholds()
        {
            return await _context.Thresholds.ToListAsync();
        }

        [HttpGet("sensorid/{sensorid}")]
        public async Task<ActionResult<IEnumerable<ThresholdWithSensorTypeDescription>>> GetThresholdsBySensorId(int sensorid)
        {
            var threshold = await (from t in _context.Thresholds
                                   join st in _context.SensorTypes
                                   on t.Typeid equals st.Typeid
                                   join s in _context.Sensors
                                   on t.Sensorid equals s.Sensorid
                                   where t.Sensorid == sensorid
                                   select new ThresholdWithSensorTypeDescription()
                                   {
                                       Deveui = s.Deveui,
                                       Thresholdid = t.Thresholdid,
                                       Upperthreshold = t.Upperthreshold,
                                       Lowerthreshold = t.Lowerthreshold,
                                       Typeid = t.Typeid,
                                       Sensorid = t.Sensorid,
                                       TypeDescription = st.Description
                                   }).ToListAsync();

            if (threshold == null)
            {
                return NotFound();
            }
            return threshold;
        }
        [HttpGet("sensorid/buildingid/{sensorid}/{buildingid}")]
        public async Task<ActionResult<IEnumerable<ThresholdWithSensorTypeDescription>>> GetThresholdsBySensorIdAndBuilding(int sensorid, int buildingid)
        {
            var threshold = await (from t in _context.Thresholds
                                   join st in _context.SensorTypes
                                   on t.Typeid equals st.Typeid
                                   join s in _context.Sensors
                                   on t.Sensorid equals s.Sensorid
                                   join l in _context.Levels
                                   on s.Levelid equals l.Levelid
                                   where t.Sensorid == sensorid && l.BuildingId == buildingid
                                   select new ThresholdWithSensorTypeDescription()
                                   {
                                       Thresholdid = t.Thresholdid,
                                       Upperthreshold = t.Upperthreshold,
                                       Lowerthreshold = t.Lowerthreshold,
                                       Typeid = t.Typeid,
                                       Sensorid = t.Sensorid,
                                       TypeDescription = st.Description
                                   }).ToListAsync();

            if (threshold == null)
            {
                return NotFound();
            }
            return threshold;
        }

        // GET: api/Threshold/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Threshold>> GetThreshold(int id)
        {
            var threshold = await _context.Thresholds.FindAsync(id);

            if (threshold == null)
            {
                return NotFound();
            }

            return threshold;
        }

        // PUT: api/Threshold/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutThreshold(int id, Threshold threshold)
        {
            if (id != threshold.Thresholdid)
            {
                return BadRequest();
            }

            _context.Entry(threshold).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ThresholdExists(id))
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

        // POST: api/Threshold
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Threshold>> PostThreshold(Threshold threshold)
        {
            _context.Thresholds.Add(threshold);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (ThresholdExists(threshold.Thresholdid))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetThreshold", new { id = threshold.Thresholdid }, threshold);
        }

        // DELETE: api/Threshold/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteThreshold(int id)
        {
            var threshold = await _context.Thresholds.FindAsync(id);
            if (threshold == null)
            {
                return NotFound();
            }

            _context.Thresholds.Remove(threshold);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ThresholdExists(int id)
        {
            return _context.Thresholds.Any(e => e.Thresholdid == id);
        }

        [HttpPost("threshold")]
        public async Task<ActionResult> CreateThreshold(CreateThresholdDto createThresholdDto)
        {
            var sensoridFromSensor = await _context.Sensors.Where(t => t.Deveui == createThresholdDto.deveui).FirstAsync();
            var typeidFromType = await _context.SensorTypes.Where(t => t.Type == createThresholdDto.type).FirstAsync();
            Threshold threshold = new()
            {
                Upperthreshold = createThresholdDto.upperthreshold,
                Lowerthreshold = createThresholdDto.lowerthreshold,
                Sensorid = sensoridFromSensor.Sensorid,
                Typeid = typeidFromType.Typeid,
            };
            var thresholdToCheck = await _context.Thresholds.Where(t => t.Sensorid == sensoridFromSensor.Sensorid).Where(t => t.Typeid == typeidFromType.Typeid).ToListAsync();
            if (thresholdToCheck.Count == 0)
            {
                _context.Thresholds.Add(threshold);
                await _context.SaveChangesAsync();
            }
            else
            {
                return StatusCode(409, $"Threshold already exists with the same deveui and type.");
            }
            _context.Thresholds.Add(threshold);
            await _context.SaveChangesAsync();
            return Ok();
        }

        /// <summary>
        /// Delete Threshold by thresholdid
        /// </summary>
        [HttpDelete("threshold/{thresholdid}")]
        public async Task<ActionResult> DeleteThresholdByThresholdID(int thresholdid)
        {
            var threshold = await _context.Thresholds.FindAsync(thresholdid);
            if (threshold == null)
                return NotFound();
            var itemToDelete = await _context.Thresholds.FindAsync(thresholdid);
            if (itemToDelete == null)
                return NotFound();
            _context.Thresholds.Remove(itemToDelete);
            await _context.SaveChangesAsync();
            return Ok();
        }

        /// <summary>
        /// Update Threshold by thresholdid and parameters provided
        /// </summary>
        [HttpPut("threshold")]
        public async Task<ActionResult> UpdateThreshold(UpdateThresholdDto updateThresholdDto)
        {
            var sensoridFromSensor = await _context.Sensors.Where(t => t.Deveui == updateThresholdDto.deveui).FirstAsync();
            var typeidFromType = await _context.SensorTypes.Where(t => t.Type == updateThresholdDto.type).FirstAsync();
            var thresholdToCheck = await _context.Thresholds.Where(t => t.Sensorid == sensoridFromSensor.Sensorid).Where(t => t.Typeid == typeidFromType.Typeid).FirstAsync();
            if (thresholdToCheck == null)
                return NotFound();
            Threshold threshold = new()
            {
                Upperthreshold = updateThresholdDto.upperthreshold,
                Lowerthreshold = updateThresholdDto.lowerthreshold,
            };
            var itemToUpdate = await _context.Thresholds.FindAsync(thresholdToCheck.Thresholdid);
            if (itemToUpdate == null)
                return NotFound();
            itemToUpdate.Upperthreshold = threshold.Upperthreshold;
            itemToUpdate.Lowerthreshold = threshold.Lowerthreshold;
            await _context.SaveChangesAsync();
            return Ok();
        }

        /// <summary>
        /// Retrieves all Threshold
        /// </summary>
        [HttpGet("threshold/all")]
        public async Task<ActionResult<IEnumerable<Threshold>>> GetAllThresholds()
        {
            var threshold = await _context.Thresholds.ToListAsync();
            if (threshold == null)
                return NotFound();
            return Ok(threshold);
        }

        /// <summary>
        /// Retrieves Threshold Data by thresholdid
        /// </summary>
        [HttpGet("threshold/{thresholdid}")]
        public async Task<ActionResult<Threshold>> GetThresholdByID(int thresholdid)
        {
            var thresholdData = await _context.Thresholds.FindAsync(thresholdid);
            if (thresholdData == null)
                return NotFound();
            return Ok(thresholdData);
        }
    }
}
