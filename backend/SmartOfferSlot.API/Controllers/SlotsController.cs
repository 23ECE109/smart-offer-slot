using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartOfferSlot.API.Data;
using SmartOfferSlot.API.DTOs;
using SmartOfferSlot.API.Models;

namespace SmartOfferSlot.API.Controllers;

[ApiController]
[Route("api")]
public class SlotsController : ControllerBase
{
    private readonly AppDbContext _db;

    public SlotsController(AppDbContext db) => _db = db;

    /// <summary>Get all slots (Admin)</summary>
    [HttpGet("slots")]
    [Authorize]
    public async Task<IActionResult> GetAll([FromQuery] int? offerId)
    {
        var query = _db.OfferSlots.Include(s => s.Offer).AsQueryable();
        if (offerId.HasValue) query = query.Where(s => s.OfferId == offerId.Value);
        var slots = await query.OrderBy(s => s.SlotDate).ThenBy(s => s.StartTime).ToListAsync();
        return Ok(slots.Select(MapToDto));
    }

    /// <summary>Get slots for a specific offer (public)</summary>
    [HttpGet("offers/{offerId}/slots")]
    public async Task<IActionResult> GetByOffer(int offerId)
    {
        var slots = await _db.OfferSlots
            .Include(s => s.Offer)
            .Where(s => s.OfferId == offerId)
            .OrderBy(s => s.SlotDate).ThenBy(s => s.StartTime)
            .ToListAsync();
        return Ok(slots.Select(MapToDto));
    }

    /// <summary>Create slot (Admin)</summary>
    [HttpPost("slots")]
    [Authorize]
    public async Task<IActionResult> Create([FromBody] CreateSlotRequest req)
    {
        var offer = await _db.Offers.FindAsync(req.OfferId);
        if (offer == null) return BadRequest(new { message = "Offer not found" });

        var slot = new OfferSlot
        {
            OfferId = req.OfferId, SlotDate = req.SlotDate,
            StartTime = req.StartTime, EndTime = req.EndTime,
            Capacity = req.Capacity, Status = req.Status
        };

        _db.OfferSlots.Add(slot);
        await _db.SaveChangesAsync();

        var created = await _db.OfferSlots.Include(s => s.Offer).FirstAsync(s => s.Id == slot.Id);
        return CreatedAtAction(nameof(GetAll), new { offerId = slot.OfferId }, MapToDto(created));
    }

    /// <summary>Update slot (Admin)</summary>
    [HttpPut("slots/{id}")]
    [Authorize]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateSlotRequest req)
    {
        var slot = await _db.OfferSlots.Include(s => s.Offer).FirstOrDefaultAsync(s => s.Id == id);
        if (slot == null) return NotFound();

        slot.SlotDate = req.SlotDate; slot.StartTime = req.StartTime;
        slot.EndTime = req.EndTime; slot.Capacity = req.Capacity; slot.Status = req.Status;

        await _db.SaveChangesAsync();
        return Ok(MapToDto(slot));
    }

    /// <summary>Delete slot (Admin)</summary>
    [HttpDelete("slots/{id}")]
    [Authorize]
    public async Task<IActionResult> Delete(int id)
    {
        var slot = await _db.OfferSlots.FindAsync(id);
        if (slot == null) return NotFound();
        _db.OfferSlots.Remove(slot);
        await _db.SaveChangesAsync();
        return NoContent();
    }

    private static SlotDto MapToDto(OfferSlot s) => new()
    {
        Id = s.Id, OfferId = s.OfferId, OfferTitle = s.Offer?.Title ?? "",
        SlotDate = s.SlotDate, StartTime = s.StartTime, EndTime = s.EndTime,
        Capacity = s.Capacity, BookedCount = s.BookedCount,
        AvailableCount = s.Capacity - s.BookedCount, Status = s.Status, CreatedAt = s.CreatedAt
    };
}
