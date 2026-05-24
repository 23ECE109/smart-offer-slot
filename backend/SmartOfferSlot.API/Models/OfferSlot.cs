namespace SmartOfferSlot.API.Models;

public class OfferSlot
{
    public int Id { get; set; }
    public int OfferId { get; set; }
    public DateTime SlotDate { get; set; }
    public string StartTime { get; set; } = string.Empty;
    public string EndTime { get; set; } = string.Empty;
    public int Capacity { get; set; }
    public int BookedCount { get; set; } = 0;
    public int AvailableCount => Capacity - BookedCount;
    public string Status { get; set; } = "Available"; // Available, Full, Closed, Expired, Cancelled
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Offer? Offer { get; set; }
    public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
}
