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
    public class SensorTypeController : ControllerBase
    {
        private readonly C4Context _context;

        public SensorTypeController(C4Context context)
        {
            _context = context;
        }

        // GET: api/SensorType
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SensorType>>> GetSensorTypes()
        {
            return await _context.SensorTypes.ToListAsync();
        }
        [HttpGet("worksite/{worksiteid}")]
        public async Task<ActionResult<IEnumerable<SensorType>>> GetSensorTypesByWorkSite(int worksiteid)
        {
            var sensorTypeData = await _context.SensorTypes.Where(x => x.WorksiteId == worksiteid).ToListAsync();
            if (sensorTypeData == null)
            {
                return NotFound();
            }

            return sensorTypeData;
        }

        // GET: api/SensorType/5
        [HttpGet("{id}")]
        public async Task<ActionResult<SensorType>> GetSensorType(int id)
        {
            var sensorType = await _context.SensorTypes.FindAsync(id);

            if (sensorType == null)
            {
                return NotFound();
            }

            return sensorType;
        }

        // PUT: api/SensorType/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutSensorType(int id, SensorType sensorType)
        {
            if (id != sensorType.Typeid)
            {
                return BadRequest();
            }

            _context.Entry(sensorType).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!SensorTypeExists(id))
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

        // POST: api/SensorType
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<SensorType>> PostSensorType(SensorType sensorType)
        {
            _context.SensorTypes.Add(sensorType);
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (SensorTypeExists(sensorType.Typeid))
                {
                    return Conflict();
                }
                else
                {
                    throw;
                }
            }

            return CreatedAtAction("GetSensorType", new { id = sensorType.Typeid }, sensorType);
        }

        // DELETE: api/SensorType/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSensorType(int id)
        {
            var sensorType = await _context.SensorTypes.FindAsync(id);
            if (sensorType == null)
            {
                return NotFound();
            }

            _context.SensorTypes.Remove(sensorType);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool SensorTypeExists(int id)
        {
            return _context.SensorTypes.Any(e => e.Typeid == id);
        }

        //----------------------------------------------//
        //------------------SensorType------------------//
        //----------------------------------------------//

        /// <summary>
        /// Creates SensorType from parameters provided
        /// </summary>
        /// <remarks>
        /// 
        /// worksite_id is worksite_id of Worksite table
        /// 
        /// </remarks>
        [HttpPost("type")]
        public async Task<ActionResult> CreateSensorType(CreateSensorTypeDto createSensorTypeDto)
        {
            SensorType sensorType = new()
            {
                Type = createSensorTypeDto.type,
                Description = createSensorTypeDto.description,
                Format = createSensorTypeDto.format,
                Display = 0,
                WorksiteId = createSensorTypeDto.worksite_id,
            };

            var itemToCheck = await _context.SensorTypes.Where(t => t.Type == sensorType.Type).ToListAsync();
            if (itemToCheck.Count == 0)
            {
                _context.SensorTypes.Add(sensorType);
                await _context.SaveChangesAsync();
            }
            else
            {
                return Ok();
            }
            await _context.SaveChangesAsync();
            return Ok();
        }

        /// <summary>
        /// Delete SensorType by type name
        /// </summary>
        /// <remarks>
        /// 
        /// type is type of SensorType table
        /// 
        /// </remarks>
        [HttpDelete("type/{type}")]
        public async Task<ActionResult> DeleteSensorType(string type)
        {
            var itemToReturn = await _context.SensorTypes.Where(t => t.Type == type).ToListAsync();
            if (itemToReturn.Count == 0)
            {
                return NotFound();
            }
            var sensortype = itemToReturn.First();
            if (sensortype == null)
                return NotFound();
            var itemToDelete = await _context.SensorTypes.Where(t => t.Type == type).ToListAsync();
            if (itemToDelete == null)
                throw new NullReferenceException();
            _context.SensorTypes.Remove(itemToDelete.First());
            await _context.SaveChangesAsync();
            return Ok();
        }

        /// <summary>
        /// Update SensorType by type and parameters provided
        /// </summary>
        /// <remarks>
        /// 
        /// type is type of SensorType table
        /// 
        /// worksite_id is worksite_id of Worksite table
        /// 
        /// </remarks>
        [HttpPut("type/{type}")]
        public async Task<ActionResult> UpdateSensorType(string type, UpdateSensorTypeDto updateSensorTypeDto)
        {
            var itemToReturn = await _context.SensorTypes.Where(t => t.Type == type).ToListAsync();
            if (itemToReturn.Count == 0)
            {
                return NotFound();
            }
            var sensortype = itemToReturn.First();
            if (sensortype == null)
                return NotFound();
            SensorType sensorType = new()
            {
                Type = type,
                Description = updateSensorTypeDto.description,
                Format = updateSensorTypeDto.format,
                WorksiteId = updateSensorTypeDto.worksite_id,
            };
            var item = await _context.SensorTypes.Where(t => t.Type == sensorType.Type).ToListAsync();
            var itemToUpdate = item.First();
            var display = itemToUpdate.Display;
            if (itemToUpdate == null)
                throw new NullReferenceException();
            itemToUpdate.Type = sensorType.Type;
            itemToUpdate.Description = sensorType.Description;
            itemToUpdate.Format = sensorType.Format;
            itemToUpdate.WorksiteId = sensorType.WorksiteId;
            itemToUpdate.Display = display;
            await _context.SaveChangesAsync();
            return Ok();
        }

        /// <summary>
        /// Retrieves SensorType by type
        /// </summary>
        /// <remarks>
        /// 
        /// type is type of SensorType
        /// 
        /// </remarks>
        [HttpGet("type/{type}")]
        public async Task<ActionResult<SensorType>> GetSensorType(string type)
        {
            var itemToReturn = await _context.SensorTypes.Where(t => t.Type == type).ToListAsync();
            if (itemToReturn.Count == 0)
            {
                return NotFound();
            }
            return Ok(itemToReturn.First());


        }

        /// <summary>
        /// Retrieves all SensorType
        /// </summary>
        [HttpGet("type/all")]
        public async Task<ActionResult<IEnumerable<SensorType>>> GetAllSensorTypes()
        {
            var sensorType = await _context.SensorTypes.ToListAsync();
            if (sensorType == null)
                return NotFound();
            return Ok(sensorType);
        }
    }
}
