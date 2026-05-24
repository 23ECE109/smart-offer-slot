namespace SmartOfferSlot.API.DTOs;

public class BusinessDto
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
    public DateTime CreatedAt { get; set; }
}

public class CreateBusinessRequest
{
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
}

public class UpdateBusinessRequest : CreateBusinessRequest { }
