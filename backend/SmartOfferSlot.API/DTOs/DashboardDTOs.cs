namespace SmartOfferSlot.API.DTOs;

public class DashboardSummaryDto
{
    public int TotalOffers { get; set; }
    public int ActiveOffers { get; set; }
    public int TotalBookings { get; set; }
    public int TodaysBookings { get; set; }
    public int TotalCapacity { get; set; }
    public int BookedSeats { get; set; }
    public int AvailableSeats { get; set; }
    public double ConversionRate { get; set; }
    public List<RecentBookingDto> RecentBookings { get; set; } = new();
}

public class RecentBookingDto
{
    public int Id { get; set; }
    public string BookingReference { get; set; } = string.Empty;
    public string CustomerName { get; set; } = string.Empty;
    public string OfferName { get; set; } = string.Empty;
    public string SlotTime { get; set; } = string.Empty;
    public int PeopleCount { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}
