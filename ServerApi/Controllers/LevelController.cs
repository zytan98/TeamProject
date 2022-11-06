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
    public class LevelController : ControllerBase
    {
        private readonly C4Context _context;

        public LevelController(C4Context context)
        {
            _context = context;
        }

        // GET: api/Level
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Level>>> GetLevels()
        {
            return await _context.Levels.ToListAsync();
        }

        // GET: api/Level/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Level>> GetLevel(int id)
        {
            var level = await _context.Levels.FindAsync(id);

            if (level == null)
            {
                return NotFound();
            }

            return level;
        }

        [HttpGet("checkWorksite/{worksiteid}")]
        public async Task<ActionResult<IEnumerable<LevelSensor>>> GetLevelFromWorksite(int worksiteid)
        {

            var query = from  l in _context.Levels
                        join b in _context.Buildings
                        on l.BuildingId equals b.BuildingId
                        where b.WorksiteId == worksiteid
                        select new LevelSensor{Levelid = l.Levelid,BuildingLevel = l.BuildingLevel, BuildingName = b.BuildingName};

            var level = await query.ToListAsync();

            if (level == null)
            {
                return NotFound();
            }

            return level;

        }

        // PUT: api/Level/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutLevel(int id, Level level)
        {
            if (id != level.Levelid)
            {
                return BadRequest();
            }

            _context.Entry(level).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!LevelExists(id))
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

        // POST: api/Level
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Level>> PostLevel(Level level)
        {
            _context.Levels.Add(level);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetLevel", new { id = level.Levelid }, level);
        }

        // DELETE: api/Level/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteLevel(int id)
        {
            var level = await _context.Levels.FindAsync(id);
            if (level == null)
            {
                return NotFound();
            }

            _context.Levels.Remove(level);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool LevelExists(int id)
        {
            return _context.Levels.Any(e => e.Levelid == id);
        }
    }
}
