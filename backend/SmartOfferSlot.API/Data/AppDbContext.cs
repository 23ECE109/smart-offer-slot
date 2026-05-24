using Microsoft.EntityFrameworkCore;
using SmartOfferSlot.API.Models;

namespace SmartOfferSlot.API.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Business> Businesses => Set<Business>();
    public DbSet<Offer> Offers => Set<Offer>();
    public DbSet<OfferSlot> OfferSlots => Set<OfferSlot>();
    public DbSet<Booking> Bookings => Set<Booking>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>(e =>
        {
            e.HasKey(x => x.Id);
            e.HasIndex(x => x.Email).IsUnique();
            e.Property(x => x.Email).IsRequired().HasMaxLength(200);
            e.Property(x => x.PasswordHash).IsRequired();
            e.Property(x => x.Role).HasDefaultValue("Admin");
        });

        modelBuilder.Entity<Business>(e =>
        {
            e.HasKey(x => x.Id);
            e.HasOne(x => x.User).WithMany().HasForeignKey(x => x.UserId);
            e.Property(x => x.Name).IsRequired().HasMaxLength(200);
            e.Property(x => x.BusinessType).IsRequired().HasMaxLength(100);
        });

        modelBuilder.Entity<Offer>(e =>
        {
            e.HasKey(x => x.Id);
            e.HasOne(x => x.Business).WithMany(b => b.Offers).HasForeignKey(x => x.BusinessId);
            e.Property(x => x.OriginalPrice).HasColumnType("decimal(18,2)");
            e.Property(x => x.OfferPrice).HasColumnType("decimal(18,2)");
            e.Property(x => x.DiscountPercentage).HasColumnType("decimal(5,2)");
            e.Property(x => x.Status).HasDefaultValue("Draft");
            e.Ignore(x => x.Slots);
            e.Ignore(x => x.Bookings);
        });

        modelBuilder.Entity<Offer>()
            .HasMany(o => o.Slots)
            .WithOne(s => s.Offer)
            .HasForeignKey(s => s.OfferId);

        modelBuilder.Entity<Offer>()
            .HasMany(o => o.Bookings)
            .WithOne(b => b.Offer)
            .HasForeignKey(b => b.OfferId);

        modelBuilder.Entity<OfferSlot>(e =>
        {
            e.HasKey(x => x.Id);
            e.Ignore(x => x.AvailableCount);
            e.Property(x => x.Status).HasDefaultValue("Available");
        });

        modelBuilder.Entity<OfferSlot>()
            .HasMany(s => s.Bookings)
            .WithOne(b => b.Slot)
            .HasForeignKey(b => b.SlotId);

        modelBuilder.Entity<Booking>(e =>
        {
            e.HasKey(x => x.Id);
            e.HasIndex(x => x.BookingReference).IsUnique();
            e.Property(x => x.BookingReference).IsRequired().HasMaxLength(50);
            e.Property(x => x.Status).HasDefaultValue("Pending");
        });

        // Admin user is seeded at startup in Program.cs
    }
}
