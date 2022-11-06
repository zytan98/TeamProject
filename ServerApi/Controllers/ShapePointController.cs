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
    public class ShapePointController : ControllerBase
    {
        private readonly C4Context _context;

        public ShapePointController(C4Context context)
        {
            _context = context;
        }

        // GET: api/ShapePoint
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ShapePoint>>> GetShapePoints()
        {
            return await _context.ShapePoints.ToListAsync();
        }
        // GET: api/ShapePoint
        [HttpGet("byworksiteId/{worksiteid}")]
        public async Task<ActionResult<IEnumerable<object>>> GetShapePointsByWorksiteId(int worksiteid)
        {
            var query = await (from building in _context.Buildings
                               where building.WorksiteId == worksiteid
                               select new Building
                               {
                                   BuildingId = building.BuildingId,
                                   WorksiteId = building.WorksiteId,
                                   Restricted = building.Restricted,
                                   BuildingName = building.BuildingName
                               }).ToListAsync();
            foreach (var building in query)
            {
                var pointsQuery = await (from points in _context.ShapePoints
                                         where points.BuildingId == building.BuildingId
                                         select new ShapePoint
                                         {
                                             ShapePointsId = points.ShapePointsId,
                                             BuildingId = points.BuildingId,
                                             XPoint = points.XPoint,
                                             YPoint = points.YPoint
                                         }).ToListAsync();
                building.ShapePoints = pointsQuery;

            }
            return query;
        }

        // GET: api/ShapePoint/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ShapePoint>> GetShapePoint(int id)
        {
            var shapePoint = await _context.ShapePoints.FindAsync(id);

            if (shapePoint == null)
            {
                return NotFound();
            }

            return shapePoint;
        }

        // PUT: api/ShapePoint/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutShapePoint(int id, ShapePoint shapePoint)
        {
            if (id != shapePoint.ShapePointsId)
            {
                return BadRequest();
            }

            _context.Entry(shapePoint).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ShapePointExists(id))
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

        // POST: api/ShapePoint
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Boolean>> PostShapePoint(ShapePoint shapePoint)
        {
            _context.ShapePoints.Add(shapePoint);
            await _context.SaveChangesAsync();

            return true;
        }
        [HttpPost("bulk")]
        public async Task<ActionResult<Boolean>> PostShapePointList(List<ShapePoint> shapePoint)
        {
            Console.WriteLine(shapePoint);
            ShapePoint lastShape = new ShapePoint();
            foreach (var shape in shapePoint)
            {
                lastShape = shape;
                _context.ShapePoints.Add(shape);
                await _context.SaveChangesAsync();
            }
            return true;
        }

        // DELETE: api/ShapePoint/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteShapePoint(int id)
        {
            var shapePoint = await _context.ShapePoints.FindAsync(id);
            if (shapePoint == null)
            {
                return NotFound();
            }

            _context.ShapePoints.Remove(shapePoint);
            await _context.SaveChangesAsync();

            return NoContent();
        }    // DELETE: api/ShapePoint/5
        [HttpDelete("bybuildingid/{buildingid}")]
        public async Task<IActionResult> DeleteShapePointByBuildingId(int buildingid)
        {
            var listOfShapePoints = await _context.ShapePoints.Where(x => x.BuildingId == buildingid).ToListAsync();
            foreach (var shape in listOfShapePoints)
            {
                var shapePoint = await _context.ShapePoints.FindAsync(shape.ShapePointsId);
                if (shapePoint == null)
                {
                    return NotFound();
                }

                _context.ShapePoints.Remove(shapePoint);
                await _context.SaveChangesAsync();
            }


            return NoContent();
        }

        private bool ShapePointExists(int id)
        {
            return _context.ShapePoints.Any(e => e.ShapePointsId == id);
        }
    }
}
