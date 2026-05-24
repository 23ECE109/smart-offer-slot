namespace SmartOfferSlot.API.Models;

public class Business
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string BusinessType { get; set; } = string.Empty;
    public string OwnerName { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string? LogoUrl { get; set; }
    public string OpeningTime { get; set; } = "09:00";
    public string ClosingTime { get; set; } = "21:00";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public User? User { get; set; }
    public ICollection<Offer> Offers { get; set; } = new List<Offer>();
}
