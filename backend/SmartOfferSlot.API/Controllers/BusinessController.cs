using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartOfferSlot.API.Data;
using SmartOfferSlot.API.DTOs;
using SmartOfferSlot.API.Models;
using System.Security.Claims;

namespace SmartOfferSlot.API.Controllers;

[ApiController]
[Route("api/business")]
public class BusinessController : ControllerBase
{
    private readonly AppDbContext _db;

    public BusinessController(AppDbContext db) => _db = db;

    private int GetUserId() => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    /// <summary>Get all businesses (public)</summary>
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var businesses = await _db.Businesses
            .Select(b => new BusinessDto
            {
                Id = b.Id, UserId = b.UserId, Name = b.Name, BusinessType = b.BusinessType,
                OwnerName = b.OwnerName, Phone = b.Phone, Email = b.Email,
                Address = b.Address, City = b.City, LogoUrl = b.LogoUrl,
                OpeningTime = b.OpeningTime, ClosingTime = b.ClosingTime, CreatedAt = b.CreatedAt
            }).ToListAsync();
        return Ok(businesses);
    }

    /// <summary>Get business by ID</summary>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var b = await _db.Businesses.FindAsync(id);
        if (b == null) return NotFound();
        return Ok(MapToDto(b));
    }

    /// <summary>Create business profile (Admin)</summary>
    [HttpPost]
    [Authorize]
    public async Task<IActionResult> Create([FromBody] CreateBusinessRequest req)
    {
        var userId = GetUserId();
        var business = new Business
        {
            UserId = userId, Name = req.Name, BusinessType = req.BusinessType,
            OwnerName = req.OwnerName, Phone = req.Phone, Email = req.Email,
            Address = req.Address, City = req.City, LogoUrl = req.LogoUrl,
            OpeningTime = req.OpeningTime, ClosingTime = req.ClosingTime
        };
        _db.Businesses.Add(business);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = business.Id }, MapToDto(business));
    }

    /// <summary>Update business profile (Admin)</summary>
    [HttpPut("{id}")]
    [Authorize]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateBusinessRequest req)
    {
        var business = await _db.Businesses.FindAsync(id);
        if (business == null) return NotFound();

        business.Name = req.Name; business.BusinessType = req.BusinessType;
        business.OwnerName = req.OwnerName; business.Phone = req.Phone;
        business.Email = req.Email; business.Address = req.Address;
        business.City = req.City; business.LogoUrl = req.LogoUrl;
        business.OpeningTime = req.OpeningTime; business.ClosingTime = req.ClosingTime;

        await _db.SaveChangesAsync();
        return Ok(MapToDto(business));
    }

    private static BusinessDto MapToDto(Business b) => new()
    {
        Id = b.Id, UserId = b.UserId, Name = b.Name, BusinessType = b.BusinessType,
        OwnerName = b.OwnerName, Phone = b.Phone, Email = b.Email,
        Address = b.Address, City = b.City, LogoUrl = b.LogoUrl,
        OpeningTime = b.OpeningTime, ClosingTime = b.ClosingTime, CreatedAt = b.CreatedAt
    };
}
