using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ServerApi.Models;
using System.Text;

namespace ServerApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SiteImageController : ControllerBase
    {
        private readonly C4Context _context;

        public SiteImageController(C4Context context)
        {
            _context = context;
        }

        // GET: api/SiteImage
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SiteImage>>> GetSiteImages()
        {
            return await _context.SiteImages.OrderBy(x=>x.SiteImageId).ToListAsync();
        }

        // GET: api/SiteImage
        [HttpGet("getHighestId")]
        public async Task<ActionResult<SiteImage>> GetSiteImageHighestId()
        {
            return await _context.SiteImages.OrderByDescending(x => x.SiteImageId).FirstOrDefaultAsync();
        }

        // GET: api/SiteImage/5
        [HttpGet("{id}")]
        public async Task<ActionResult<SiteImage>> GetSiteImage(int id)
        {
            var siteImage = await _context.SiteImages.FindAsync(id);

            if (siteImage == null)
            {
                return NotFound();
            }

            return siteImage;
        }

        // PUT: api/SiteImage/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{siteimageid}")]
        public async Task<IActionResult> PutSiteImage(int siteimageid, string siteimage)
        {
            var entity = await _context.SiteImages.FirstOrDefaultAsync(x => x.SiteImageId == siteimageid);
            if (entity != null)
            {
                entity.SiteImage1 = System.Convert.FromBase64String(siteimage);
                _context.Entry(entity).Property(p => p.SiteImage1).IsModified = true;
                _context.SaveChanges();
            }

            return NoContent();
        }

        // POST: api/SiteImage
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<SiteImage>> PostSiteImage(SiteImage siteImage)
        {
            _context.SiteImages.Add(siteImage);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetSiteImage", new { id = siteImage.SiteImageId }, siteImage);
        }

        // DELETE: api/SiteImage/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSiteImage(int id)
        {
            var siteImage = await _context.SiteImages.FindAsync(id);
            if (siteImage == null)
            {
                return NotFound();
            }

            _context.SiteImages.Remove(siteImage);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool SiteImageExists(int id)
        {
            return _context.SiteImages.Any(e => e.SiteImageId == id);
        }
    }
}
