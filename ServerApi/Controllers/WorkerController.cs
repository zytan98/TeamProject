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
    public class WorkerController : ControllerBase
    {
        private readonly C4Context _context;

        public WorkerController(C4Context context)
        {
            _context = context;
        }

        // GET: api/Worker
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Worker>>> GetWorkers()
        {
            return await _context.Workers.ToListAsync();
        }


        // GET: api/Worker
        [HttpGet("CheckInOut")]
        public async Task<ActionResult<List<WorkerCheckInOut>>> GetWorkersByCheckIn(String checkInDate, int buildingId)
        {
            var item = await (
    from ai in _context.Workers
    join al in _context.CheckInOuts on ai.Id equals al.WorkerId
    join c in _context.Companies on ai.CompanyId equals c.Id
    where ((al.BuildingId == buildingId) && (al.CheckInDate.ToString().Contains(checkInDate)))
    select new WorkerCheckInOut()
    {
        Name = ai.Name,
        PhoneNumber = ai.PhoneNumber,
        CheckInTime = al.CheckInTime,
        CheckOutTime = al.CheckOutTime,
        CheckInDate = al.CheckInDate,
        CheckOutDate = al.CheckOutDate,
        BuildingId = al.BuildingId,
        CompanyName = c.CompanyName,
        Id = al.Id
    }).ToListAsync();
            return item;
        }

        // GET: api/Worker/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Worker>> GetWorker(int id)
        {
            var worker = await _context.Workers.FindAsync(id);

            if (worker == null)
            {
                return NotFound();
            }

            return worker;
        }

        // PUT: api/Worker/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutWorker(int id, Worker worker)
        {
            if (id != worker.Id)
            {
                return BadRequest();
            }

            _context.Entry(worker).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!WorkerExists(id))
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

        // POST: api/Worker
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Worker>> PostWorker(Worker worker)
        {
            _context.Workers.Add(worker);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetWorker", new { id = worker.Id }, worker);
        }

        // DELETE: api/Worker/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteWorker(int id)
        {
            var worker = await _context.Workers.FindAsync(id);
            if (worker == null)
            {
                return NotFound();
            }

            _context.Workers.Remove(worker);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool WorkerExists(int id)
        {
            return _context.Workers.Any(e => e.Id == id);
        }
    }
}
