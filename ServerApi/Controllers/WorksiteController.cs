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
    public class WorksiteController : ControllerBase
    {
        private readonly C4Context _context;

        public WorksiteController(C4Context context)
        {
            _context = context;
        }

        // GET: api/Worksite
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Worksite>>> GetWorksites()
        {
            return await _context.Worksites.ToListAsync();
        }

        [HttpGet("{worksitename}/preset")]
        public async Task<ActionResult<Worksite>> GetWorksitesid(string worksitename)
        {
            var worksiteid = await _context.Worksites.FirstOrDefaultAsync(x => x.WorksiteName == worksitename);

            if (worksiteid == null)
            {
                return NotFound();
            }

            return worksiteid;
        }

        

        [HttpGet("siteImage/{id}")]
        public async Task<ActionResult<Worksite>> GetsiteImageId(int id)
        {
            var siteImageId = await _context.Worksites.FirstOrDefaultAsync(x => x.WorksiteId == id);

            if (siteImageId == null)
            {
                return NotFound();
            }

            return siteImageId;
        }

        // GET: api/Worksite/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Worksite>> GetWorksite(string id)
        {
            var worksite = await _context.Worksites.FindAsync(id);

            if (worksite == null)
            {
                return NotFound();
            }

            return worksite;
        }

        //PUT: api/Worksite/5
        //To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        // [HttpPut("{id}")]
        // public async Task<IActionResult> PutWorksite(int id, Worksite worksite)
        // {
        //     if (id != worksite.WorksiteId)
        //     {
        //         return BadRequest();
        //     }

        //     _context.Entry(worksite).State = EntityState.Modified;

        //     try
        //     {
        //         await _context.SaveChangesAsync();
        //     }
        //     catch (DbUpdateConcurrencyException)
        //     {
        //         if (!WorksiteExists(id))
        //         {
        //             return NotFound();
        //         }
        //         else
        //         {
        //             throw;
        //         }
        //     }

        //     return NoContent();
        // }

        [HttpPut("{worksiteid}/{siteimageid}")]
        public async Task<IActionResult> PutWorksite(int worksiteid, int siteimageid)
        {
            var entity = await _context.Worksites.FirstOrDefaultAsync(x => x.WorksiteId == worksiteid);
            if (entity != null)
            {
                entity.SiteImageId = siteimageid;
                _context.Attach(entity);
                _context.Entry(entity).Property(p => p.SiteImageId).IsModified = true;
                _context.SaveChanges();
            }
            return NoContent();
        }

        // POST: api/Worksite
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Worksite>> PostWorksite(Worksite worksite)
        {
            _context.Worksites.Add(worksite);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetWorksite", new { id = worksite.WorksiteId }, worksite);
        }

        // DELETE: api/Worksite/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteWorksite(int id)
        {
            var worksite = await _context.Worksites.FindAsync(id);
            if (worksite == null)
            {
                return NotFound();
            }

            _context.Worksites.Remove(worksite);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool WorksiteExists(int id)
        {
            return _context.Worksites.Any(e => e.WorksiteId == id);
        }
    }
}
