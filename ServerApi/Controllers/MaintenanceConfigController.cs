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
    public class MaintenanceConfigController : ControllerBase
    {
        private readonly C4Context _context;

        public MaintenanceConfigController(C4Context context)
        {
            _context = context;
        }

        // GET: api/MaintenanceConfig
        [HttpGet]
        public async Task<ActionResult<IEnumerable<MaintenanceConfig>>> GetMaintenanceConfigs()
        {
            return await _context.MaintenanceConfigs.ToListAsync();
        }

        [HttpGet("preset/{worksiteid}")]
        public async Task<ActionResult<MaintenanceConfig>> GetMaintenanceConfigId(int worksiteid)
        {
            var query = from mc in _context.MaintenanceConfigs
                        join ws in _context.Worksites
                        on mc.WorksiteId equals ws.WorksiteId
                        where ws.WorksiteId == worksiteid
                        select new MaintenanceConfig{MaintenanceConfigId = mc.MaintenanceConfigId ,WorksiteId=mc.WorksiteId, MaintenanceConfigValue=mc.MaintenanceConfigValue};

            var maintenanceconfig = await query.FirstAsync();

            if (maintenanceconfig == null)
            {
                return NotFound();
            }

            return maintenanceconfig;
        }
        // GET: api/MaintenanceConfig/5
        [HttpGet("{id}")]
        public async Task<ActionResult<MaintenanceConfig>> GetMaintenanceConfig(int id)
        {
            var maintenanceConfig = await _context.MaintenanceConfigs.FindAsync(id);

            if (maintenanceConfig == null)
            {
                return NotFound();
            }

            return maintenanceConfig;
        }

        // PUT: api/MaintenanceConfig/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMaintenanceConfig(int id, MaintenanceConfig maintenanceConfig)
        {
            if (id != maintenanceConfig.MaintenanceConfigId)
            {
                return BadRequest();
            }

            _context.Entry(maintenanceConfig).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MaintenanceConfigExists(id))
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

        // POST: api/MaintenanceConfig
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<MaintenanceConfig>> PostMaintenanceConfig(MaintenanceConfig maintenanceConfig)
        {
            _context.MaintenanceConfigs.Add(maintenanceConfig);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetMaintenanceConfig", new { id = maintenanceConfig.MaintenanceConfigId }, maintenanceConfig);
        }

        // DELETE: api/MaintenanceConfig/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMaintenanceConfig(int id)
        {
            var maintenanceConfig = await _context.MaintenanceConfigs.FindAsync(id);
            if (maintenanceConfig == null)
            {
                return NotFound();
            }

            _context.MaintenanceConfigs.Remove(maintenanceConfig);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool MaintenanceConfigExists(int id)
        {
            return _context.MaintenanceConfigs.Any(e => e.MaintenanceConfigId == id);
        }
    }
}
