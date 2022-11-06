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
    public class MaintenanceController : ControllerBase
    {
        private readonly C4Context _context;

        public MaintenanceController(C4Context context)
        {
            _context = context;
        }

        // GET: api/Maintenance
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Maintenance>>> GetMaintenances()
        {
            return await _context.Maintenances.ToListAsync();
        }

        [HttpGet("searchproject/{worksiteid}")]
        public async Task<ActionResult<IEnumerable<Maintenance>>> GetMaintenancesProject(int worksiteid)
        {
            var query = from m in _context.Maintenances
                        join s in _context.Sensors
                        on m.Sensorid equals s.Sensorid
                        join l in _context.Levels
                        on s.Levelid equals l.Levelid
                        join b in _context.Buildings
                        on l.BuildingId equals b.BuildingId
                        join ws in _context.Worksites
                        on b.WorksiteId equals ws.WorksiteId
                        where ws.WorksiteId == worksiteid
                        select new Maintenance { Id = m.Id, StartDate = m.StartDate, Responsible = m.Responsible, Remarks = m.Remarks, Completed = m.Completed, Sensorid = m.Sensorid};
            var maintenance = await query.ToListAsync();

            if (maintenance == null)
            {
                return NotFound();
            }

            return maintenance;
        }

        [HttpGet("search/{deveui}/{worksiteid}")]
        public async Task<ActionResult<IEnumerable<Maintenance>>> GetMaintenancesSensor(String deveui,int worksiteid)
        {
            var query = from m in _context.Maintenances
                        join s in _context.Sensors
                        on m.Sensorid equals s.Sensorid
                        join l in _context.Levels
                        on s.Levelid equals l.Levelid
                        join b in _context.Buildings
                        on l.BuildingId equals b.BuildingId
                        join ws in _context.Worksites
                        on b.WorksiteId equals ws.WorksiteId
                        where s.Deveui == deveui 
                        where ws.WorksiteId == worksiteid
                        select new Maintenance { Id = m.Id, StartDate = m.StartDate, Responsible = m.Responsible, Remarks = m.Remarks, Completed = m.Completed, Sensorid = m.Sensorid };
            var maintenance = await query.ToListAsync();

            if (maintenance == null || !maintenance.Any()) 
            {
                return NotFound();
            }

            return maintenance;
        }
        [HttpGet("search/{year}/{month}/{day}/{worksiteid}")]
        public async Task<ActionResult<IEnumerable<MaintenanceDate>>> GetMaintenancesDates(string year, string month, string day, int worksiteid)
        {
            var query = from m in _context.Maintenances
                        join s in _context.Sensors
                        on m.Sensorid equals s.Sensorid
                        join l in _context.Levels
                        on s.Levelid equals l.Levelid
                        join b in _context.Buildings
                        on l.BuildingId equals b.BuildingId
                        join ws in _context.Worksites
                        on b.WorksiteId equals ws.WorksiteId
                        where ws.WorksiteId == worksiteid
                        where m.StartDate == DateTime.Parse(year + "-" + month + "-" + day)
                        select new MaintenanceDate { Id = m.Id, StartDate = m.StartDate, Responsible = m.Responsible, Remarks = m.Remarks, Completed = m.Completed, Sensorid = m.Sensorid, Deveui = s.Deveui};
            var maintenance = await query.ToListAsync();
            if (maintenance == null)
            {
                return NotFound();
            }

            return maintenance;
        }
        [HttpGet("search/missed/{worksiteid}")]
        public async Task<ActionResult<IEnumerable<MaintenanceDate>>> GetMaintenancesMissed(int worksiteid)
        {
            var query = from m in _context.Maintenances
                        join s in _context.Sensors
                        on m.Sensorid equals s.Sensorid
                        join l in _context.Levels
                        on s.Levelid equals l.Levelid
                        join b in _context.Buildings
                        on l.BuildingId equals b.BuildingId
                        join ws in _context.Worksites
                        on b.WorksiteId equals ws.WorksiteId
                        where ws.WorksiteId == worksiteid
                        where m.Completed == false
                        where m.StartDate < (DateTime.Now).Date
                        select new MaintenanceDate { Id = m.Id, StartDate = m.StartDate, Responsible = m.Responsible, Remarks = m.Remarks, Completed = m.Completed, Sensorid = m.Sensorid,Deveui = s.Deveui };
            var maintenance = await query.ToListAsync();
            if (maintenance == null)
            {
                return NotFound();
            }

            return maintenance;
        }


        // GET: api/Maintenance/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Maintenance>> GetMaintenance(int id)
        {
            var maintenance = await _context.Maintenances.FindAsync(id);

            if (maintenance == null)
            {
                return NotFound();
            }

            return maintenance;
        }

        // PUT: api/Maintenance/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMaintenance(int id, Maintenance maintenance)
        {
            if (id != maintenance.Id)
            {
                return BadRequest();
            }

            _context.Entry(maintenance).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MaintenanceExists(id))
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

        // POST: api/Maintenance
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Maintenance>> PostMaintenance(Maintenance maintenance)
        {
            _context.Maintenances.Add(maintenance);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetMaintenance", new { id = maintenance.Id }, maintenance);
        }
        [HttpPost("{deveui}")]
        public async Task<ActionResult<Maintenance>> PostMaintenanceSensor(Maintenance maintenance, string deveui)
        {
            _context.Maintenances.Add(maintenance);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetMaintenance", new { id = maintenance.Id }, maintenance);
        }

        // DELETE: api/Maintenance/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMaintenance(int id)
        {
            var maintenance = await _context.Maintenances.FindAsync(id);
            if (maintenance == null)
            {
                return NotFound();
            }

            _context.Maintenances.Remove(maintenance);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool MaintenanceExists(int id)
        {
            return _context.Maintenances.Any(e => e.Id == id);
        }
    }
}
