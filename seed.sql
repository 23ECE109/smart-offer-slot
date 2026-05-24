USE SmartOfferSlotDb;

SET @adminId = (SELECT Id FROM Users LIMIT 1);

-- Clear existing demo data (keep users)
DELETE FROM bookings;
DELETE FROM offerslots;
DELETE FROM offers;
DELETE FROM businesses;

-- Businesses
INSERT INTO businesses (UserId, Name, BusinessType, OwnerName, Phone, Email, Address, City, OpeningTime, ClosingTime, CreatedAt) VALUES
(@adminId, 'FitZone Gym', 'Gym', 'Arjun Mehta', '9876543210', 'fitzone@gmail.com', '12 MG Road', 'Bangalore', '06:00', '22:00', NOW());
INSERT INTO businesses (UserId, Name, BusinessType, OwnerName, Phone, Email, Address, City, OpeningTime, ClosingTime, CreatedAt) VALUES
(@adminId, 'Glow Salon', 'Salon', 'Priya Sharma', '9845123456', 'glowsalon@gmail.com', '45 Brigade Road', 'Bangalore', '09:00', '20:00', NOW());
INSERT INTO businesses (UserId, Name, BusinessType, OwnerName, Phone, Email, Address, City, OpeningTime, ClosingTime, CreatedAt) VALUES
(@adminId, 'SpiceGarden Restaurant', 'Restaurant', 'Ravi Kumar', '9731234567', 'spicegarden@gmail.com', '78 Koramangala', 'Bangalore', '11:00', '23:00', NOW());
INSERT INTO businesses (UserId, Name, BusinessType, OwnerName, Phone, Email, Address, City, OpeningTime, ClosingTime, CreatedAt) VALUES
(@adminId, 'HealthFirst Clinic', 'Clinic', 'Dr. Sneha Rao', '9654321098', 'healthfirst@gmail.com', '23 Indiranagar', 'Bangalore', '08:00', '18:00', NOW());
INSERT INTO businesses (UserId, Name, BusinessType, OwnerName, Phone, Email, Address, City, OpeningTime, ClosingTime, CreatedAt) VALUES
(@adminId, 'GreenTurf Sports', 'Turf', 'Kiran Patel', '9512345678', 'greenturf@gmail.com', '56 Whitefield', 'Bangalore', '05:00', '23:00', NOW());

-- Get IDs
SET @gymId    = (SELECT Id FROM businesses WHERE Name = 'FitZone Gym' LIMIT 1);
SET @salonId  = (SELECT Id FROM businesses WHERE Name = 'Glow Salon' LIMIT 1);
SET @restId   = (SELECT Id FROM businesses WHERE Name = 'SpiceGarden Restaurant' LIMIT 1);
SET @clinicId = (SELECT Id FROM businesses WHERE Name = 'HealthFirst Clinic' LIMIT 1);
SET @turfId   = (SELECT Id FROM businesses WHERE Name = 'GreenTurf Sports' LIMIT 1);

-- Offers
INSERT INTO offers (BusinessId, Title, Description, Category, OriginalPrice, OfferPrice, DiscountPercentage, StartDate, EndDate, StartTime, EndTime, TotalCapacity, MaxBookingPerCustomer, TermsAndConditions, Status, CreatedAt, UpdatedAt) VALUES
(@gymId, 'Morning Gym Trial', 'Try our fully equipped gym for a full morning session. Includes access to all equipment and locker room.', 'Fitness', 499, 99, 80.16, NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), '06:00', '10:00', 20, 1, 'Valid for first-time visitors only. Non-transferable.', 'Active', NOW(), NOW());
INSERT INTO offers (BusinessId, Title, Description, Category, OriginalPrice, OfferPrice, DiscountPercentage, StartDate, EndDate, StartTime, EndTime, TotalCapacity, MaxBookingPerCustomer, TermsAndConditions, Status, CreatedAt, UpdatedAt) VALUES
(@gymId, 'Evening Zumba Class', 'High energy Zumba session with certified trainer. Burn calories and have fun!', 'Fitness', 799, 199, 75.09, NOW(), DATE_ADD(NOW(), INTERVAL 20 DAY), '18:00', '19:30', 15, 2, 'Wear comfortable clothes. Bring water bottle.', 'Active', NOW(), NOW());
INSERT INTO offers (BusinessId, Title, Description, Category, OriginalPrice, OfferPrice, DiscountPercentage, StartDate, EndDate, StartTime, EndTime, TotalCapacity, MaxBookingPerCustomer, TermsAndConditions, Status, CreatedAt, UpdatedAt) VALUES
(@salonId, 'Salon Happy Hour', 'Get a premium haircut, wash and blow-dry at an unbeatable price during happy hours.', 'Beauty', 1200, 399, 66.75, NOW(), DATE_ADD(NOW(), INTERVAL 15 DAY), '10:00', '14:00', 10, 1, 'Appointment required. No walk-ins during offer period.', 'Active', NOW(), NOW());
INSERT INTO offers (BusinessId, Title, Description, Category, OriginalPrice, OfferPrice, DiscountPercentage, StartDate, EndDate, StartTime, EndTime, TotalCapacity, MaxBookingPerCustomer, TermsAndConditions, Status, CreatedAt, UpdatedAt) VALUES
(@salonId, 'Bridal Makeup Trial', 'Full bridal makeup trial session with our expert artists. Includes skin prep and styling.', 'Beauty', 3500, 999, 71.46, NOW(), DATE_ADD(NOW(), INTERVAL 25 DAY), '09:00', '17:00', 5, 1, 'Trial session lasts 2 hours. Prior booking mandatory.', 'Active', NOW(), NOW());
INSERT INTO offers (BusinessId, Title, Description, Category, OriginalPrice, OfferPrice, DiscountPercentage, StartDate, EndDate, StartTime, EndTime, TotalCapacity, MaxBookingPerCustomer, TermsAndConditions, Status, CreatedAt, UpdatedAt) VALUES
(@restId, 'Lunch Hour Special', 'Enjoy a 3-course meal including starter, main course and dessert at a special lunch price.', 'Food', 850, 299, 64.82, NOW(), DATE_ADD(NOW(), INTERVAL 10 DAY), '12:00', '15:00', 30, 4, 'Dine-in only. Not valid on weekends.', 'Active', NOW(), NOW());
INSERT INTO offers (BusinessId, Title, Description, Category, OriginalPrice, OfferPrice, DiscountPercentage, StartDate, EndDate, StartTime, EndTime, TotalCapacity, MaxBookingPerCustomer, TermsAndConditions, Status, CreatedAt, UpdatedAt) VALUES
(@restId, 'Weekend Buffet Deal', 'Unlimited buffet with 40+ dishes including live counters. Perfect for family outings.', 'Food', 1500, 599, 60.07, NOW(), DATE_ADD(NOW(), INTERVAL 14 DAY), '19:00', '22:30', 50, 6, 'Valid Saturday and Sunday only. Children below 5 free.', 'Active', NOW(), NOW());
INSERT INTO offers (BusinessId, Title, Description, Category, OriginalPrice, OfferPrice, DiscountPercentage, StartDate, EndDate, StartTime, EndTime, TotalCapacity, MaxBookingPerCustomer, TermsAndConditions, Status, CreatedAt, UpdatedAt) VALUES
(@clinicId, 'Doctor Consultation', 'Consult with our experienced general physician. Includes basic health checkup and prescription.', 'Health', 800, 199, 75.13, NOW(), DATE_ADD(NOW(), INTERVAL 20 DAY), '09:00', '13:00', 20, 1, 'Carry previous medical records if any.', 'Active', NOW(), NOW());
INSERT INTO offers (BusinessId, Title, Description, Category, OriginalPrice, OfferPrice, DiscountPercentage, StartDate, EndDate, StartTime, EndTime, TotalCapacity, MaxBookingPerCustomer, TermsAndConditions, Status, CreatedAt, UpdatedAt) VALUES
(@turfId, 'Morning Turf Slot', 'Book a full-size football turf for your team. Includes changing room and basic equipment.', 'Sports', 2000, 699, 65.05, NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY), '06:00', '08:00', 22, 11, 'Minimum 10 players required. Studs allowed.', 'Active', NOW(), NOW());
INSERT INTO offers (BusinessId, Title, Description, Category, OriginalPrice, OfferPrice, DiscountPercentage, StartDate, EndDate, StartTime, EndTime, TotalCapacity, MaxBookingPerCustomer, TermsAndConditions, Status, CreatedAt, UpdatedAt) VALUES
(@turfId, 'Evening Cricket Net', 'Practice cricket in our professional nets with bowling machine access.', 'Sports', 600, 149, 75.17, NOW(), DATE_ADD(NOW(), INTERVAL 20 DAY), '17:00', '19:00', 12, 2, 'Bring your own bat. Balls provided.', 'Active', NOW(), NOW());
INSERT INTO offers (BusinessId, Title, Description, Category, OriginalPrice, OfferPrice, DiscountPercentage, StartDate, EndDate, StartTime, EndTime, TotalCapacity, MaxBookingPerCustomer, TermsAndConditions, Status, CreatedAt, UpdatedAt) VALUES
(@gymId, 'Personal Training Session', 'One-on-one session with a certified personal trainer. Customized workout plan included.', 'Fitness', 2500, 799, 68.04, NOW(), DATE_ADD(NOW(), INTERVAL 15 DAY), '07:00', '20:00', 8, 1, 'Session duration 60 minutes. Prior fitness assessment done.', 'Active', NOW(), NOW());

-- Get offer IDs
SET @o1  = (SELECT Id FROM offers WHERE Title = 'Morning Gym Trial' LIMIT 1);
SET @o2  = (SELECT Id FROM offers WHERE Title = 'Evening Zumba Class' LIMIT 1);
SET @o3  = (SELECT Id FROM offers WHERE Title = 'Salon Happy Hour' LIMIT 1);
SET @o4  = (SELECT Id FROM offers WHERE Title = 'Bridal Makeup Trial' LIMIT 1);
SET @o5  = (SELECT Id FROM offers WHERE Title = 'Lunch Hour Special' LIMIT 1);
SET @o6  = (SELECT Id FROM offers WHERE Title = 'Weekend Buffet Deal' LIMIT 1);
SET @o7  = (SELECT Id FROM offers WHERE Title = 'Doctor Consultation' LIMIT 1);
SET @o8  = (SELECT Id FROM offers WHERE Title = 'Morning Turf Slot' LIMIT 1);
SET @o9  = (SELECT Id FROM offers WHERE Title = 'Evening Cricket Net' LIMIT 1);
SET @o10 = (SELECT Id FROM offers WHERE Title = 'Personal Training Session' LIMIT 1);

-- Slots
INSERT INTO offerslots (OfferId, SlotDate, StartTime, EndTime, Capacity, BookedCount, Status, CreatedAt) VALUES (@o1, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '06:00', '10:00', 20, 14, 'Available', NOW());
INSERT INTO offerslots (OfferId, SlotDate, StartTime, EndTime, Capacity, BookedCount, Status, CreatedAt) VALUES (@o1, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '06:00', '10:00', 20, 8, 'Available', NOW());
INSERT INTO offerslots (OfferId, SlotDate, StartTime, EndTime, Capacity, BookedCount, Status, CreatedAt) VALUES (@o1, DATE_ADD(CURDATE(), INTERVAL 3 DAY), '06:00', '10:00', 20, 20, 'Full', NOW());
INSERT INTO offerslots (OfferId, SlotDate, StartTime, EndTime, Capacity, BookedCount, Status, CreatedAt) VALUES (@o2, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '18:00', '19:30', 15, 6, 'Available', NOW());
INSERT INTO offerslots (OfferId, SlotDate, StartTime, EndTime, Capacity, BookedCount, Status, CreatedAt) VALUES (@o2, DATE_ADD(CURDATE(), INTERVAL 3 DAY), '18:00', '19:30', 15, 15, 'Full', NOW());
INSERT INTO offerslots (OfferId, SlotDate, StartTime, EndTime, Capacity, BookedCount, Status, CreatedAt) VALUES (@o3, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '10:00', '14:00', 10, 3, 'Available', NOW());
INSERT INTO offerslots (OfferId, SlotDate, StartTime, EndTime, Capacity, BookedCount, Status, CreatedAt) VALUES (@o3, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '10:00', '14:00', 10, 7, 'Available', NOW());
INSERT INTO offerslots (OfferId, SlotDate, StartTime, EndTime, Capacity, BookedCount, Status, CreatedAt) VALUES (@o4, DATE_ADD(CURDATE(), INTERVAL 5 DAY), '09:00', '17:00', 5, 2, 'Available', NOW());
INSERT INTO offerslots (OfferId, SlotDate, StartTime, EndTime, Capacity, BookedCount, Status, CreatedAt) VALUES (@o5, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '12:00', '15:00', 30, 18, 'Available', NOW());
INSERT INTO offerslots (OfferId, SlotDate, StartTime, EndTime, Capacity, BookedCount, Status, CreatedAt) VALUES (@o5, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '12:00', '15:00', 30, 25, 'Available', NOW());
INSERT INTO offerslots (OfferId, SlotDate, StartTime, EndTime, Capacity, BookedCount, Status, CreatedAt) VALUES (@o6, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '19:00', '22:30', 50, 32, 'Available', NOW());
INSERT INTO offerslots (OfferId, SlotDate, StartTime, EndTime, Capacity, BookedCount, Status, CreatedAt) VALUES (@o6, DATE_ADD(CURDATE(), INTERVAL 9 DAY), '19:00', '22:30', 50, 10, 'Available', NOW());
INSERT INTO offerslots (OfferId, SlotDate, StartTime, EndTime, Capacity, BookedCount, Status, CreatedAt) VALUES (@o7, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '09:00', '13:00', 20, 12, 'Available', NOW());
INSERT INTO offerslots (OfferId, SlotDate, StartTime, EndTime, Capacity, BookedCount, Status, CreatedAt) VALUES (@o7, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '09:00', '13:00', 20, 5, 'Available', NOW());
INSERT INTO offerslots (OfferId, SlotDate, StartTime, EndTime, Capacity, BookedCount, Status, CreatedAt) VALUES (@o8, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '06:00', '08:00', 22, 11, 'Available', NOW());
INSERT INTO offerslots (OfferId, SlotDate, StartTime, EndTime, Capacity, BookedCount, Status, CreatedAt) VALUES (@o8, DATE_ADD(CURDATE(), INTERVAL 3 DAY), '06:00', '08:00', 22, 22, 'Full', NOW());
INSERT INTO offerslots (OfferId, SlotDate, StartTime, EndTime, Capacity, BookedCount, Status, CreatedAt) VALUES (@o9, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '17:00', '19:00', 12, 4, 'Available', NOW());
INSERT INTO offerslots (OfferId, SlotDate, StartTime, EndTime, Capacity, BookedCount, Status, CreatedAt) VALUES (@o9, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '17:00', '19:00', 12, 8, 'Available', NOW());
INSERT INTO offerslots (OfferId, SlotDate, StartTime, EndTime, Capacity, BookedCount, Status, CreatedAt) VALUES (@o10, DATE_ADD(CURDATE(), INTERVAL 1 DAY), '07:00', '08:00', 8, 3, 'Available', NOW());
INSERT INTO offerslots (OfferId, SlotDate, StartTime, EndTime, Capacity, BookedCount, Status, CreatedAt) VALUES (@o10, DATE_ADD(CURDATE(), INTERVAL 2 DAY), '09:00', '10:00', 8, 5, 'Available', NOW());
INSERT INTO offerslots (OfferId, SlotDate, StartTime, EndTime, Capacity, BookedCount, Status, CreatedAt) VALUES (@o10, DATE_ADD(CURDATE(), INTERVAL 4 DAY), '17:00', '18:00', 8, 1, 'Available', NOW());

-- Get slot IDs for bookings
SET @s1  = (SELECT Id FROM offerslots WHERE OfferId = @o1 ORDER BY Id LIMIT 1);
SET @s2  = (SELECT Id FROM offerslots WHERE OfferId = @o1 ORDER BY Id LIMIT 1 OFFSET 1);
SET @s3  = (SELECT Id FROM offerslots WHERE OfferId = @o2 ORDER BY Id LIMIT 1);
SET @s4  = (SELECT Id FROM offerslots WHERE OfferId = @o3 ORDER BY Id LIMIT 1);
SET @s5  = (SELECT Id FROM offerslots WHERE OfferId = @o5 ORDER BY Id LIMIT 1);
SET @s6  = (SELECT Id FROM offerslots WHERE OfferId = @o6 ORDER BY Id LIMIT 1);
SET @s7  = (SELECT Id FROM offerslots WHERE OfferId = @o7 ORDER BY Id LIMIT 1);
SET @s8  = (SELECT Id FROM offerslots WHERE OfferId = @o8 ORDER BY Id LIMIT 1);
SET @s9  = (SELECT Id FROM offerslots WHERE OfferId = @o9 ORDER BY Id LIMIT 1);
SET @s10 = (SELECT Id FROM offerslots WHERE OfferId = @o10 ORDER BY Id LIMIT 1);

-- Bookings
INSERT INTO bookings (BookingReference, OfferId, SlotId, CustomerName, CustomerPhone, CustomerEmail, PeopleCount, SpecialNote, Status, CreatedAt) VALUES ('SOS-20260524-A1B2C3', @o1, @s1, 'Rahul Verma', '9876501234', 'rahul.v@gmail.com', 1, NULL, 'Confirmed', DATE_SUB(NOW(), INTERVAL 2 DAY));
INSERT INTO bookings (BookingReference, OfferId, SlotId, CustomerName, CustomerPhone, CustomerEmail, PeopleCount, SpecialNote, Status, CreatedAt) VALUES ('SOS-20260524-D4E5F6', @o1, @s1, 'Ananya Singh', '9845678901', 'ananya.s@gmail.com', 1, 'Please keep locker ready', 'Confirmed', DATE_SUB(NOW(), INTERVAL 1 DAY));
INSERT INTO bookings (BookingReference, OfferId, SlotId, CustomerName, CustomerPhone, CustomerEmail, PeopleCount, SpecialNote, Status, CreatedAt) VALUES ('SOS-20260524-G7H8I9', @o1, @s2, 'Vikram Nair', '9731122334', NULL, 1, NULL, 'Confirmed', DATE_SUB(NOW(), INTERVAL 1 DAY));
INSERT INTO bookings (BookingReference, OfferId, SlotId, CustomerName, CustomerPhone, CustomerEmail, PeopleCount, SpecialNote, Status, CreatedAt) VALUES ('SOS-20260524-J1K2L3', @o2, @s3, 'Deepa Krishnan', '9654433221', 'deepa.k@gmail.com', 2, 'Beginner level please', 'Confirmed', DATE_SUB(NOW(), INTERVAL 3 DAY));
INSERT INTO bookings (BookingReference, OfferId, SlotId, CustomerName, CustomerPhone, CustomerEmail, PeopleCount, SpecialNote, Status, CreatedAt) VALUES ('SOS-20260524-M4N5O6', @o3, @s4, 'Meera Pillai', '9512233445', 'meera.p@gmail.com', 1, NULL, 'Confirmed', DATE_SUB(NOW(), INTERVAL 2 DAY));
INSERT INTO bookings (BookingReference, OfferId, SlotId, CustomerName, CustomerPhone, CustomerEmail, PeopleCount, SpecialNote, Status, CreatedAt) VALUES ('SOS-20260524-P7Q8R9', @o5, @s5, 'Suresh Babu', '9876612345', 'suresh.b@gmail.com', 3, 'Window seat preferred', 'Confirmed', DATE_SUB(NOW(), INTERVAL 1 DAY));
INSERT INTO bookings (BookingReference, OfferId, SlotId, CustomerName, CustomerPhone, CustomerEmail, PeopleCount, SpecialNote, Status, CreatedAt) VALUES ('SOS-20260524-S1T2U3', @o5, @s5, 'Kavitha Reddy', '9845523456', NULL, 2, NULL, 'Pending', DATE_SUB(NOW(), INTERVAL 4 HOUR));
INSERT INTO bookings (BookingReference, OfferId, SlotId, CustomerName, CustomerPhone, CustomerEmail, PeopleCount, SpecialNote, Status, CreatedAt) VALUES ('SOS-20260524-V4W5X6', @o6, @s6, 'Arun Chandran', '9731634567', 'arun.c@gmail.com', 4, 'Anniversary dinner', 'Confirmed', DATE_SUB(NOW(), INTERVAL 5 DAY));
INSERT INTO bookings (BookingReference, OfferId, SlotId, CustomerName, CustomerPhone, CustomerEmail, PeopleCount, SpecialNote, Status, CreatedAt) VALUES ('SOS-20260524-Y7Z8A1', @o7, @s7, 'Lakshmi Iyer', '9654745678', 'lakshmi.i@gmail.com', 1, 'Diabetic patient', 'Confirmed', DATE_SUB(NOW(), INTERVAL 2 DAY));
INSERT INTO bookings (BookingReference, OfferId, SlotId, CustomerName, CustomerPhone, CustomerEmail, PeopleCount, SpecialNote, Status, CreatedAt) VALUES ('SOS-20260524-B2C3D4', @o8, @s8, 'Karthik Rajan', '9512856789', NULL, 11, 'Need extra balls', 'Confirmed', DATE_SUB(NOW(), INTERVAL 3 DAY));
INSERT INTO bookings (BookingReference, OfferId, SlotId, CustomerName, CustomerPhone, CustomerEmail, PeopleCount, SpecialNote, Status, CreatedAt) VALUES ('SOS-20260524-E5F6G7', @o9, @s9, 'Pradeep Kumar', '9876967890', 'pradeep.k@gmail.com', 2, NULL, 'Confirmed', DATE_SUB(NOW(), INTERVAL 1 DAY));
INSERT INTO bookings (BookingReference, OfferId, SlotId, CustomerName, CustomerPhone, CustomerEmail, PeopleCount, SpecialNote, Status, CreatedAt) VALUES ('SOS-20260524-H8I9J0', @o10, @s10, 'Divya Menon', '9845078901', 'divya.m@gmail.com', 1, 'Focus on weight loss', 'Confirmed', DATE_SUB(NOW(), INTERVAL 6 HOUR));
INSERT INTO bookings (BookingReference, OfferId, SlotId, CustomerName, CustomerPhone, CustomerEmail, PeopleCount, SpecialNote, Status, CreatedAt) VALUES ('SOS-20260524-K1L2M3', @o1, @s1, 'Sanjay Gupta', '9731189012', NULL, 1, NULL, 'Completed', DATE_SUB(NOW(), INTERVAL 7 DAY));
INSERT INTO bookings (BookingReference, OfferId, SlotId, CustomerName, CustomerPhone, CustomerEmail, PeopleCount, SpecialNote, Status, CreatedAt) VALUES ('SOS-20260524-N4O5P6', @o5, @s5, 'Pooja Nambiar', '9654290123', 'pooja.n@gmail.com', 2, NULL, 'Cancelled', DATE_SUB(NOW(), INTERVAL 3 DAY));
INSERT INTO bookings (BookingReference, OfferId, SlotId, CustomerName, CustomerPhone, CustomerEmail, PeopleCount, SpecialNote, Status, CreatedAt) VALUES ('SOS-20260524-Q7R8S9', @o7, @s7, 'Mohan Das', '9512301234', NULL, 1, 'Bring reports from last visit', 'NoShow', DATE_SUB(NOW(), INTERVAL 4 DAY));
