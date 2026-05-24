namespace SmartOfferSlot.API.Models;

public class Offer
{
    public int Id { get; set; }
    public int BusinessId { get; set; }
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
    public int MaxBookingPerCustomer { get; set; } = 1;
    public string? TermsAndConditions { get; set; }
    public string Status { get; set; } = "Draft"; // Draft, Active, Paused, Expired, Cancelled
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public Business? Business { get; set; }
    public ICollection<OfferSlot> Slots { get; set; } = new List<OfferSlot>();
    public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
}
