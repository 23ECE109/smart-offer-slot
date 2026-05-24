using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartOfferSlot.API.Data;
using SmartOfferSlot.API.DTOs;

namespace SmartOfferSlot.API.Controllers;

[ApiController]
[Route("api/dashboard")]
[Authorize]
public class DashboardController : ControllerBase
{
    private readonly AppDbContext _db;

    public DashboardController(AppDbContext db) => _db = db;

    /// <summary>Get dashboard summary</summary>
    [HttpGet("summary")]
    public async Task<IActionResult> GetSummary()
    {
        var today = DateTime.UtcNow.Date;

        var totalOffers = await _db.Offers.CountAsync();
        var activeOffers = await _db.Offers.CountAsync(o => o.Status == "Active");
        var totalBookings = await _db.Bookings.CountAsync(b => b.Status != "Cancelled");
        var todaysBookings = await _db.Bookings.CountAsync(b => b.CreatedAt.Date == today && b.Status != "Cancelled");

        var slots = await _db.OfferSlots.ToListAsync();
        var totalCapacity = slots.Sum(s => s.Capacity);
        var bookedSeats = slots.Sum(s => s.BookedCount);
        var availableSeats = totalCapacity - bookedSeats;
        var conversionRate = totalCapacity > 0 ? Math.Round((double)bookedSeats / totalCapacity * 100, 1) : 0;

        var recentBookings = await _db.Bookings
            .Include(b => b.Offer)
            .Include(b => b.Slot)
            .OrderByDescending(b => b.CreatedAt)
            .Take(10)
            .Select(b => new RecentBookingDto
            {
                Id = b.Id,
                BookingReference = b.BookingReference,
                CustomerName = b.CustomerName,
                OfferName = b.Offer != null ? b.Offer.Title : "",
                SlotTime = b.Slot != null ? $"{b.Slot.SlotDate:dd MMM} {b.Slot.StartTime} - {b.Slot.EndTime}" : "",
                PeopleCount = b.PeopleCount,
                Status = b.Status,
                CreatedAt = b.CreatedAt
            })
            .ToListAsync();

        return Ok(new DashboardSummaryDto
        {
            TotalOffers = totalOffers,
            ActiveOffers = activeOffers,
            TotalBookings = totalBookings,
            TodaysBookings = todaysBookings,
            TotalCapacity = totalCapacity,
            BookedSeats = bookedSeats,
            AvailableSeats = availableSeats,
            ConversionRate = conversionRate,
            RecentBookings = recentBookings
        });
    }
}
