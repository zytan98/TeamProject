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
    public class BuildingController : ControllerBase
    {
        private readonly C4Context _context;

        public BuildingController(C4Context context)
        {
            _context = context;
        }

        // GET: api/Building
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Building>>> GetBuildings()
        {
            return await _context.Buildings.ToListAsync();
        }

        [HttpGet("nopoints/byworksiteid/{worksiteid}")]
        public async Task<ActionResult<IEnumerable<Building>>> GetBuildingsByWorksiteIdWithNoPoints(int worksiteid)
        {

            var buildings = await _context.Buildings.Where(x => x.WorksiteId == worksiteid && x.ShapePoints.Count() == 0).ToListAsync();
            if (buildings == null)
            {
                return NotFound();
            }

            return buildings;
        }

        [HttpGet("worker/{worksiteId}")]
        public async Task<ActionResult<List<Building>>> GetBuildingId(int worksiteId)
        {
            var item = await (from b in _context.Buildings where b.WorksiteId == worksiteId 
            select new Building(){
                BuildingId = b.BuildingId

            }).ToListAsync();
            return item;
        }


        // GET: api/Building/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Building>> GetBuilding(int id)
        {
            var building = await _context.Buildings.FindAsync(id);

            if (building == null)
            {
                return NotFound();
            }

            return building;
        }

        // PUT: api/Building/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBuilding(int id, Building building)
        {
            if (id != building.BuildingId)
            {
                return BadRequest();
            }

            _context.Entry(building).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BuildingExists(id))
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

        // POST: api/Building
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Building>> PostBuilding(Building building)
        {
            _context.Buildings.Add(building);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetBuilding", new { id = building.BuildingId }, building);
        }

        // DELETE: api/Building/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBuilding(int id)
        {
            var building = await _context.Buildings.FindAsync(id);
            if (building == null)
            {
                return NotFound();
            }

            _context.Buildings.Remove(building);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool BuildingExists(int id)
        {
            return _context.Buildings.Any(e => e.BuildingId == id);
        }
    }
}
