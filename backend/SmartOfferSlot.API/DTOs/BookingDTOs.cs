namespace SmartOfferSlot.API.DTOs;

public class BookingDto
{
    public int Id { get; set; }
    public string BookingReference { get; set; } = string.Empty;
    public int OfferId { get; set; }
    public string OfferTitle { get; set; } = string.Empty;
    public string BusinessName { get; set; } = string.Empty;
    public int SlotId { get; set; }
    public DateTime SlotDate { get; set; }
    public string SlotStartTime { get; set; } = string.Empty;
    public string SlotEndTime { get; set; } = string.Empty;
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerPhone { get; set; } = string.Empty;
    public string? CustomerEmail { get; set; }
    public int PeopleCount { get; set; }
    public string? SpecialNote { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class CreateBookingRequest
{
    public int OfferId { get; set; }
    public int SlotId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public string CustomerPhone { get; set; } = string.Empty;
    public string? CustomerEmail { get; set; }
    public int PeopleCount { get; set; } = 1;
    public string? SpecialNote { get; set; }
}

public class UpdateBookingStatusRequest
{
    public string Status { get; set; } = string.Empty;
}
