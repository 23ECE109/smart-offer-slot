using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartOfferSlot.API.Data;
using SmartOfferSlot.API.DTOs;
using SmartOfferSlot.API.Models;

namespace SmartOfferSlot.API.Controllers;

[ApiController]
[Route("api/offers")]
public class OffersController : ControllerBase
{
    private readonly AppDbContext _db;

    public OffersController(AppDbContext db) => _db = db;

    /// <summary>Get all offers with optional filters (public)</summary>
    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] string? businessType,
        [FromQuery] string? category,
        [FromQuery] DateTime? date,
        [FromQuery] decimal? minPrice,
        [FromQuery] decimal? maxPrice,
        [FromQuery] bool? availableOnly,
        [FromQuery] bool? adminView)
    {
        var query = _db.Offers
            .Include(o => o.Business)
            .Include(o => o.Slots)
            .AsQueryable();

        if (adminView != true)
            query = query.Where(o => o.Status == "Active");

        if (!string.IsNullOrEmpty(businessType))
            query = query.Where(o => o.Business!.BusinessType == businessType);

        if (!string.IsNullOrEmpty(category))
            query = query.Where(o => o.Category == category);

        if (date.HasValue)
            query = query.Where(o => o.StartDate.Date <= date.Value.Date && o.EndDate.Date >= date.Value.Date);

        if (minPrice.HasValue)
            query = query.Where(o => o.OfferPrice >= minPrice.Value);

        if (maxPrice.HasValue)
            query = query.Where(o => o.OfferPrice <= maxPrice.Value);

        var offers = await query.OrderByDescending(o => o.CreatedAt).ToListAsync();

        var result = offers.Select(o => MapToDto(o)).ToList();

        if (availableOnly == true)
            result = result.Where(o => o.AvailableSlots > 0).ToList();

        return Ok(result);
    }

    /// <summary>Get offer by ID (public)</summary>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var offer = await _db.Offers
            .Include(o => o.Business)
            .Include(o => o.Slots)
            .FirstOrDefaultAsync(o => o.Id == id);

        if (offer == null) return NotFound();
        return Ok(MapToDto(offer));
    }

    /// <summary>Create offer (Admin)</summary>
    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create([FromBody] CreateOfferRequest req)
    {
        if (req.OfferPrice >= req.OriginalPrice)
            return BadRequest(new { message = "Offer price must be less than original price" });

        var discount = Math.Round((req.OriginalPrice - req.OfferPrice) / req.OriginalPrice * 100, 2);

        var offer = new Offer
        {
            BusinessId = req.BusinessId, Title = req.Title, Description = req.Description,
            Category = req.Category, OriginalPrice = req.OriginalPrice, OfferPrice = req.OfferPrice,
            DiscountPercentage = discount, StartDate = req.StartDate, EndDate = req.EndDate,
            StartTime = req.StartTime, EndTime = req.EndTime, TotalCapacity = req.TotalCapacity,
            MaxBookingPerCustomer = req.MaxBookingPerCustomer,
            TermsAndConditions = req.TermsAndConditions, Status = req.Status
        };

        _db.Offers.Add(offer);
        await _db.SaveChangesAsync();

        var created = await _db.Offers.Include(o => o.Business).Include(o => o.Slots)
            .FirstAsync(o => o.Id == offer.Id);
        return CreatedAtAction(nameof(GetById), new { id = offer.Id }, MapToDto(created));
    }

    /// <summary>Update offer (Admin)</summary>
    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateOfferRequest req)
    {
        var offer = await _db.Offers.Include(o => o.Business).Include(o => o.Slots)
            .FirstOrDefaultAsync(o => o.Id == id);
        if (offer == null) return NotFound();

        if (req.OfferPrice >= req.OriginalPrice)
            return BadRequest(new { message = "Offer price must be less than original price" });

        offer.Title = req.Title; offer.Description = req.Description;
        offer.Category = req.Category; offer.OriginalPrice = req.OriginalPrice;
        offer.OfferPrice = req.OfferPrice;
        offer.DiscountPercentage = Math.Round((req.OriginalPrice - req.OfferPrice) / req.OriginalPrice * 100, 2);
        offer.StartDate = req.StartDate; offer.EndDate = req.EndDate;
        offer.StartTime = req.StartTime; offer.EndTime = req.EndTime;
        offer.TotalCapacity = req.TotalCapacity; offer.MaxBookingPerCustomer = req.MaxBookingPerCustomer;
        offer.TermsAndConditions = req.TermsAndConditions; offer.Status = req.Status;
        offer.UpdatedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return Ok(MapToDto(offer));
    }

    /// <summary>Delete offer (Admin)</summary>
    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> Delete(int id)
    {
        var offer = await _db.Offers.FindAsync(id);
        if (offer == null) return NotFound();
        _db.Offers.Remove(offer);
        await _db.SaveChangesAsync();
        return NoContent();
    }

    private static OfferDto MapToDto(Offer o) => new()
    {
        Id = o.Id, BusinessId = o.BusinessId,
        BusinessName = o.Business?.Name ?? "",
        BusinessType = o.Business?.BusinessType ?? "",
        BusinessCity = o.Business?.City ?? "",
        Title = o.Title, Description = o.Description, Category = o.Category,
        OriginalPrice = o.OriginalPrice, OfferPrice = o.OfferPrice,
        DiscountPercentage = o.DiscountPercentage,
        StartDate = o.StartDate, EndDate = o.EndDate,
        StartTime = o.StartTime, EndTime = o.EndTime,
        TotalCapacity = o.TotalCapacity, MaxBookingPerCustomer = o.MaxBookingPerCustomer,
        TermsAndConditions = o.TermsAndConditions, Status = o.Status,
        TotalSlots = o.Slots?.Count ?? 0,
        AvailableSlots = o.Slots?.Count(s => s.Status == "Available" && s.BookedCount < s.Capacity) ?? 0,
        CreatedAt = o.CreatedAt, UpdatedAt = o.UpdatedAt
    };
}
