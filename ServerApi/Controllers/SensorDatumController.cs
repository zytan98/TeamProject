using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ServerApi.Models;

namespace ServerApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SensorDatumController : ControllerBase
    {
        private readonly C4Context _context;

        public SensorDatumController(C4Context context)
        {
            _context = context;
        }

        // GET: api/SensorDatum
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SensorDatum>>> GetSensorData()
        {
            return await _context.SensorData.ToListAsync();
        }

        // GET: api/SensorDatum/5
        [HttpGet("{id}")]
        public async Task<ActionResult<SensorDatum>> GetSensorDatum(long id)
        {
            var sensorDatum = await _context.SensorData.FindAsync(id);

            if (sensorDatum == null)
            {
                return NotFound();
            }

            return sensorDatum;
        }



        // GET: api/SensorDatum/sensorType/{id}
        [HttpGet("sensortype/{typeid}")]
        public async Task<ActionResult<List<SensorDatum>>> GetSensorDatumBySensorTypeId(int typeid)
        {
            DateTime end = DateTime.Today;
            DateTime start = DateTime.Today.AddMonths(-1);
            var sensorDatum = await _context.SensorData.Where(x => x.Typeid == typeid && x.Time >= start && x.Time <= end).OrderBy(x => x.Time).ToListAsync();
            if (sensorDatum == null)
            {
                return NotFound();
            }

            return sensorDatum;
        }

        // GET: api/SensorDatum/sensorType/{id}
        [HttpGet("average/sensortype/{typeid}")]
        public async Task<ActionResult<SensorDatumAverage>> GetSensorDatumAvgBySensorTypeId(int typeid)
        {

            DateTime end = DateTime.Today;
            DateTime start = DateTime.Today.AddMonths(-1);
            var query = await (from sensorData in _context.SensorData
                               where sensorData.Typeid == typeid
                               && sensorData.Time >= start && sensorData.Time <= end
                               group sensorData by sensorData.Typeid into sensorDataGroup
                               select new SensorDatumAverage()
                               {
                                   Typeid = typeid,
                                   Value = sensorDataGroup.Average(x => x.Value)
                               }).FirstOrDefaultAsync();
            return query;
        }
        // GET: api/SensorDatum/sensorType/{id}
        [HttpGet("building/average/sensortype/{buildingid}/{sensortypeid}")]
        public async Task<ActionResult<SensorDatumAverage>> GetSensorDatumAvgByBuildingSensorTypeId(int buildingid, int sensortypeid)
        {

            DateTime end = DateTime.Today;
            DateTime start = DateTime.Today.AddMonths(-1);
            var query = await (from l in _context.Levels
                               join s in _context.Sensors on l.Levelid equals s.Levelid
                               join d in _context.SensorData on s.Sensorid equals d.Sensorid
                               where l.BuildingId == buildingid && d.Typeid == sensortypeid && d.Time >= start && d.Time <= end
                               group d by d.Typeid into sensorDataGroup
                               select new SensorDatumAverage()
                               {
                                   Typeid = sensortypeid,
                                   Value = sensorDataGroup.Average(x => x.Value)
                               }).FirstOrDefaultAsync();
            return query;
        }
        [HttpGet("building/{buildingid}/{sensortypeid}")]
        public async Task<ActionResult<List<SensorDatum>>> GetSensorDatumAvgByBuildingId(int buildingid, int sensortypeid)
        {

            DateTime end = DateTime.Today;
            DateTime start = DateTime.Today.AddMonths(-1);
            List<SensorDatum> sensorData = new List<SensorDatum>();
            var levels = await (_context.Levels.Where(x => x.BuildingId == buildingid)).ToListAsync();
            var query = await (from l in _context.Levels
                               join s in _context.Sensors on l.Levelid equals s.Levelid
                               join d in _context.SensorData on s.Sensorid equals d.Sensorid
                               where l.BuildingId == buildingid && d.Typeid == sensortypeid && d.Time >= start && d.Time <= end
                               select new SensorDatum()
                               {
                                   Readingid = d.Readingid,
                                   Time = d.Time,
                                   Sensorid = d.Sensorid,
                                   Value = d.Value,
                                   Typeid = d.Typeid
                               }).ToListAsync();
            return query;
        }
        // PUT: api/SensorDatum/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSensorDatum(long id, SensorDatum sensorDatum)
        {
            if (id != sensorDatum.Readingid)
            {
                return BadRequest();
            }

            _context.Entry(sensorDatum).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SensorDatumExists(id))
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

        // POST: api/SensorDatum
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<SensorDatum>> PostSensorDatum(SensorDatum sensorDatum)
        {
            _context.SensorData.Add(sensorDatum);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetSensorDatum", new { id = sensorDatum.Readingid }, sensorDatum);
        }

        // DELETE: api/SensorDatum/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSensorDatum(long id)
        {
            var sensorDatum = await _context.SensorData.FindAsync(id);
            if (sensorDatum == null)
            {
                return NotFound();
            }

            _context.SensorData.Remove(sensorDatum);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool SensorDatumExists(long id)
        {
            return _context.SensorData.Any(e => e.Readingid == id);
        }
    }
}
