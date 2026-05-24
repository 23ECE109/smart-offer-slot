using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartOfferSlot.API.Data;
using SmartOfferSlot.API.DTOs;
using SmartOfferSlot.API.Models;

namespace SmartOfferSlot.API.Controllers;

[ApiController]
[Route("api/bookings")]
public class BookingsController : ControllerBase
{
    private readonly AppDbContext _db;

    public BookingsController(AppDbContext db) => _db = db;

    /// <summary>Get all bookings (Admin)</summary>
    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetAll([FromQuery] int? offerId, [FromQuery] string? status)
    {
        var query = _db.Bookings
            .Include(b => b.Offer).ThenInclude(o => o!.Business)
            .Include(b => b.Slot)
            .AsQueryable();

        if (offerId.HasValue) query = query.Where(b => b.OfferId == offerId.Value);
        if (!string.IsNullOrEmpty(status)) query = query.Where(b => b.Status == status);

        var bookings = await query.OrderByDescending(b => b.CreatedAt).ToListAsync();
        return Ok(bookings.Select(MapToDto));
    }

    /// <summary>Get booking by ID</summary>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var booking = await _db.Bookings
            .Include(b => b.Offer).ThenInclude(o => o!.Business)
            .Include(b => b.Slot)
            .FirstOrDefaultAsync(b => b.Id == id);

        if (booking == null) return NotFound();
        return Ok(MapToDto(booking));
    }

    /// <summary>Get booking by reference number (public)</summary>
    [HttpGet("ref/{reference}")]
    public async Task<IActionResult> GetByReference(string reference)
    {
        var booking = await _db.Bookings
            .Include(b => b.Offer).ThenInclude(o => o!.Business)
            .Include(b => b.Slot)
            .FirstOrDefaultAsync(b => b.BookingReference == reference);

        if (booking == null) return NotFound();
        return Ok(MapToDto(booking));
    }

    /// <summary>Create a booking (public)</summary>
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateBookingRequest req)
    {
        // Validate offer
        var offer = await _db.Offers.FindAsync(req.OfferId);
        if (offer == null) return BadRequest(new { message = "Offer not found" });
        if (offer.Status != "Active") return BadRequest(new { message = "This offer is not active" });
        if (offer.EndDate.Date < DateTime.UtcNow.Date) return BadRequest(new { message = "This offer has expired" });

        // Validate slot
        var slot = await _db.OfferSlots.FindAsync(req.SlotId);
        if (slot == null) return BadRequest(new { message = "Slot not found" });
        if (slot.Status != "Available") return BadRequest(new { message = "This slot is not available" });
        if (slot.BookedCount + req.PeopleCount > slot.Capacity)
            return BadRequest(new { message = "Not enough capacity in this slot" });

        // Check max booking per customer
        var existingBookings = await _db.Bookings
            .Where(b => b.OfferId == req.OfferId && b.CustomerPhone == req.CustomerPhone
                && b.Status != "Cancelled")
            .SumAsync(b => b.PeopleCount);

        if (existingBookings + req.PeopleCount > offer.MaxBookingPerCustomer)
            return BadRequest(new { message = $"You can only book up to {offer.MaxBookingPerCustomer} seat(s) for this offer" });

        // Create booking
        var reference = $"SOS-{DateTime.UtcNow:yyyyMMdd}-{Guid.NewGuid().ToString("N")[..6].ToUpper()}";

        var booking = new Booking
        {
            BookingReference = reference,
            OfferId = req.OfferId, SlotId = req.SlotId,
            CustomerName = req.CustomerName, CustomerPhone = req.CustomerPhone,
            CustomerEmail = req.CustomerEmail, PeopleCount = req.PeopleCount,
            SpecialNote = req.SpecialNote, Status = "Confirmed"
        };

        // Update slot booked count
        slot.BookedCount += req.PeopleCount;
        if (slot.BookedCount >= slot.Capacity) slot.Status = "Full";

        _db.Bookings.Add(booking);
        await _db.SaveChangesAsync();

        var created = await _db.Bookings
            .Include(b => b.Offer).ThenInclude(o => o!.Business)
            .Include(b => b.Slot)
            .FirstAsync(b => b.Id == booking.Id);

        return CreatedAtAction(nameof(GetById), new { id = booking.Id }, MapToDto(created));
    }

    /// <summary>Update booking status (Admin)</summary>
    [HttpPut("{id}/status")]
    [Authorize]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateBookingStatusRequest req)
    {
        var validStatuses = new[] { "Pending", "Confirmed", "Cancelled", "Completed", "NoShow" };
        if (!validStatuses.Contains(req.Status))
            return BadRequest(new { message = "Invalid status" });

        var booking = await _db.Bookings.Include(b => b.Slot).FirstOrDefaultAsync(b => b.Id == id);
        if (booking == null) return NotFound();

        // If cancelling, free up slot capacity
        if (req.Status == "Cancelled" && booking.Status != "Cancelled" && booking.Slot != null)
        {
            booking.Slot.BookedCount = Math.Max(0, booking.Slot.BookedCount - booking.PeopleCount);
            if (booking.Slot.Status == "Full") booking.Slot.Status = "Available";
        }

        booking.Status = req.Status;
        await _db.SaveChangesAsync();

        var updated = await _db.Bookings
            .Include(b => b.Offer).ThenInclude(o => o!.Business)
            .Include(b => b.Slot)
            .FirstAsync(b => b.Id == id);

        return Ok(MapToDto(updated));
    }

    private static BookingDto MapToDto(Booking b) => new()
    {
        Id = b.Id, BookingReference = b.BookingReference,
        OfferId = b.OfferId, OfferTitle = b.Offer?.Title ?? "",
        BusinessName = b.Offer?.Business?.Name ?? "",
        SlotId = b.SlotId,
        SlotDate = b.Slot?.SlotDate ?? DateTime.MinValue,
        SlotStartTime = b.Slot?.StartTime ?? "",
        SlotEndTime = b.Slot?.EndTime ?? "",
        CustomerName = b.CustomerName, CustomerPhone = b.CustomerPhone,
        CustomerEmail = b.CustomerEmail, PeopleCount = b.PeopleCount,
        SpecialNote = b.SpecialNote, Status = b.Status, CreatedAt = b.CreatedAt
    };
}
