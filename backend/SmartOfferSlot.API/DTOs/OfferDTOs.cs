namespace SmartOfferSlot.API.DTOs;

public class OfferDto
{
    public int Id { get; set; }
    public int BusinessId { get; set; }
    public string BusinessName { get; set; } = string.Empty;
    public string BusinessType { get; set; } = string.Empty;
    public string BusinessCity { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public decimal OriginalPrice { get; set; }
    public decimal OfferPrice { get; set; }
    public decimal DiscountPercentage { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string StartTime { get; set; } = string.Empty;
    public string EndTime { get; set; } = string.Empty;
    public int TotalCapacity { get; set; }
    public int MaxBookingPerCustomer { get; set; }
    public string? TermsAndConditions { get; set; }
    public string Status { get; set; } = string.Empty;
    public int TotalSlots { get; set; }
    public int AvailableSlots { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class CreateOfferRequest
{
    public int BusinessId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public decimal OriginalPrice { get; set; }
    public decimal OfferPrice { get; set; }
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
    public string StartTime { get; set; } = string.Empty;
    public string EndTime { get; set; } = string.Empty;
    public int TotalCapacity { get; set; }
    public int MaxBookingPerCustomer { get; set; } = 1;
    public string? TermsAndConditions { get; set; }
    public string Status { get; set; } = "Draft";
}

public class UpdateOfferRequest : CreateOfferRequest { }
