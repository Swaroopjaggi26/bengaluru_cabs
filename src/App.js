import { useState, useEffect, useRef } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { Badge } from "./components/ui/badge";
import { Phone, MessageCircle, MapPin, Clock, Shield, DollarSign, Car, CheckCircle } from "lucide-react";

const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mapsApiReady, setMapsApiReady] = useState(false);
  const mapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const [bookingData, setBookingData] = useState({
    name: "",
    phone: "",
    direction: "city-to-airport",
    pickup: "",
    drop: "",
    date: "",
    time: ""
  });
  
  const intervalRef = useRef(null);
  const pickupInputRef = useRef(null);
  const dropInputRef = useRef(null);

  const heroSlides = [
    {
      image: "/bengaluru-bg.png",
      title: "Travel Securely With Us!",
      subtitle: "Book Your Taxi From Anywhere Today!",
      description: "Premium taxi service with professional drivers and comfortable vehicles"
    },
    {
      image: "/airport.png",
      title: "Airport Transfers Made Easy",
      subtitle: "Starting From Just ₹99",
      description: "24/7 reliable airport pickup and drop services across Bengaluru"
    },
    {
      image: "/bengaluru-bg.png",
      title: "Comfortable City Rides",
      subtitle: "Transparent Pricing, No Hidden Charges",
      description: "Experience the best taxi service in Bengaluru with fixed rates"
    }
  ];

  // Auto-transition carousel every 3 seconds - using ref to prevent multiple intervals
  useEffect(() => {
    // Clear any existing interval first
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    // Set up new interval
    intervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 3000);
    
    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapsApiKey) {
      setMapsApiReady(false);
      return;
    }

    const existingScript = document.getElementById("google-maps-script");

    if (window.google?.maps?.places) {
      setMapsApiReady(true);
      return;
    }

    if (existingScript) {
      const handleScriptLoad = () => setMapsApiReady(true);
      existingScript.addEventListener("load", handleScriptLoad);
      return () => existingScript.removeEventListener("load", handleScriptLoad);
    }

    const mapsScript = document.createElement("script");
    mapsScript.id = "google-maps-script";
    mapsScript.async = true;
    mapsScript.defer = true;
    mapsScript.src = `https://maps.googleapis.com/maps/api/js?key=${mapsApiKey}&libraries=places`;
    mapsScript.onload = () => setMapsApiReady(true);
    document.body.appendChild(mapsScript);

    return () => {
      mapsScript.onload = null;
    };
  }, [mapsApiKey]);

  useEffect(() => {
    if (!mapsApiReady || !pickupInputRef.current || !dropInputRef.current || !window.google?.maps?.places) {
      return;
    }

    const autocompleteOptions = {
      componentRestrictions: { country: "in" },
      fields: ["formatted_address", "name"]
    };

    const pickupAutocomplete = new window.google.maps.places.Autocomplete(
      pickupInputRef.current,
      autocompleteOptions
    );
    const dropAutocomplete = new window.google.maps.places.Autocomplete(
      dropInputRef.current,
      autocompleteOptions
    );

    const pickupListener = pickupAutocomplete.addListener("place_changed", () => {
      const place = pickupAutocomplete.getPlace();
      const pickupLocation = place.formatted_address || place.name || "";
      setBookingData((prev) => ({ ...prev, pickup: pickupLocation }));
    });

    const dropListener = dropAutocomplete.addListener("place_changed", () => {
      const place = dropAutocomplete.getPlace();
      const dropLocation = place.formatted_address || place.name || "";
      setBookingData((prev) => ({ ...prev, drop: dropLocation }));
    });

    return () => {
      window.google.maps.event.removeListener(pickupListener);
      window.google.maps.event.removeListener(dropListener);
    };
  }, [mapsApiReady]);

  const handleBooking = (e) => {
    e.preventDefault();
    alert("Booking request submitted! We'll contact you shortly.");
    setBookingData({
      name: "",
      phone: "",
      direction: "city-to-airport",
      pickup: "",
      drop: "",
      date: "",
      time: ""
    });
  };

  const handleWhatsApp = () => {
    window.open("https://wa.me/919449449510?text=Hi,%20I'd%20like%20to%20book%20a%20taxi.%20Please%20assist%20me.", "_blank");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Logo in top left corner - fixed position */}
      <div className="fixed top-6 left-6 z-50">
        <img 
          src="/logo.png" 
          alt="Bengaluru Cabs" 
          className="w-56 md:w-72 h-auto drop-shadow-2xl"
        />
      </div>

      {/* Floating Action Buttons - WhatsApp & Phone - Bottom Right */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4">
        {/* WhatsApp Button */}
        <button
          onClick={handleWhatsApp}
          className="group relative bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110"
          aria-label="Contact us on WhatsApp"
        >
          <MessageCircle className="w-7 h-7" />
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            WhatsApp Us
          </span>
        </button>

        {/* Phone Button */}
        <a
          href="tel:+919449449510"
          className="group relative bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110"
          aria-label="Call us now"
        >
          <Phone className="w-7 h-7" />
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            Call Now
          </span>
        </a>
      </div>

      {/* Hero Carousel */}
      <div className="relative h-screen">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              currentSlide === index ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/60"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4">
              <p className="text-base md:text-lg uppercase tracking-widest mb-6 text-yellow-400 font-semibold drop-shadow-lg">KSTDC Airport Taxi Service</p>
              <h1 className="text-5xl md:text-7xl font-bold mb-4 text-center drop-shadow-2xl">{slide.title}</h1>
              <h2 className="text-2xl md:text-3xl mb-4 text-center text-yellow-400 font-bold drop-shadow-lg">{slide.subtitle}</h2>
              <p className="text-lg md:text-xl mb-8 text-center max-w-2xl">{slide.description}</p>
              <div className="flex gap-4">
                <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold">
                  Book Now
                </Button>
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-black">
                  <Phone className="mr-2 h-4 w-4" /> Call Us Now
                </Button>
              </div>
            </div>
          </div>
        ))}
        
        {/* Carousel indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                currentSlide === index ? "bg-yellow-500 w-8" : "bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-yellow-500 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold text-black mb-2">150+</div>
              <div className="text-black font-medium">Service Locations</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-black mb-2">24/7</div>
              <div className="text-black font-medium">Available Service</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-black mb-2">100%</div>
              <div className="text-black font-medium">Verified Drivers</div>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4">About Bengaluru Cabs</Badge>
              <h2 className="text-4xl font-bold mb-6">Experience Comfort and Relaxation with Airport Cabs!</h2>
              <p className="text-gray-600 mb-4">
                Bengaluru Cabs, based in Bengaluru, offers reliable and affordable taxi services across the city. 
                With a fleet of well-maintained vehicles and professional drivers, we ensure safe and comfortable rides for our customers.
              </p>
              <p className="text-gray-600 mb-6">
                Whether it's local commutes or airport transfers, we provide prompt and hassle-free transportation solutions. 
                We provide 24/7 (4+1) KSTDC airport taxi service in Bengaluru city to Kempegowda International Airport Limited (KIAL).
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="flex gap-3">
                  <Shield className="w-6 h-6 text-yellow-500 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold mb-1">Safe & Secure</h3>
                    <p className="text-sm text-gray-600">Verified drivers with background checks</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Clock className="w-6 h-6 text-yellow-500 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold mb-1">On-Time Service</h3>
                    <p className="text-sm text-gray-600">Punctual pickups and drops</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <DollarSign className="w-6 h-6 text-yellow-500 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold mb-1">Fixed Pricing</h3>
                    <p className="text-sm text-gray-600">Transparent rates with no hidden charges</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Car className="w-6 h-6 text-yellow-500 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold mb-1">Premium Fleet</h3>
                    <p className="text-sm text-gray-600">Well-maintained and clean vehicles</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="/bengaluru-bg.png"
                alt="Taxi Service"
                className="rounded-lg shadow-xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-yellow-500 text-black p-6 rounded-lg shadow-xl">
                <div className="text-5xl font-bold">15+</div>
                <div className="text-sm font-medium">Years of</div>
                <div className="text-lg font-bold">Experience</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Section */}
      <div className="py-20 bg-gray-50" id="booking">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4">Easy Booking</Badge>
            <h2 className="text-4xl font-bold mb-4">Book Your Taxi Now</h2>
            <p className="text-gray-600">Choose your preferred booking option and get instant confirmation</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>KSTDC Airport Taxi - Quick Booking</CardTitle>
              <CardDescription>
                Starting from ₹99 | Per KM rates: AC Sedan ₹24/km, Non-AC Hatchback ₹18/km
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="quick" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="quick">Quick Booking</TabsTrigger>
                  <TabsTrigger value="fixed">Fixed Fare</TabsTrigger>
                  <TabsTrigger value="packages">Packages</TabsTrigger>
                </TabsList>
                
                <TabsContent value="quick">
                  <form onSubmit={handleBooking} className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Your Name *</Label>
                        <Input
                          id="name"
                          value={bookingData.name}
                          onChange={(e) => setBookingData({...bookingData, name: e.target.value})}
                          placeholder="Enter your name"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={bookingData.phone}
                          onChange={(e) => setBookingData({...bookingData, phone: e.target.value})}
                          placeholder="Enter phone number"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="direction">Select Direction</Label>
                      <select
                        id="direction"
                        value={bookingData.direction}
                        onChange={(e) => setBookingData({...bookingData, direction: e.target.value})}
                        className="w-full px-3 py-2 border rounded-md"
                      >
                        <option value="city-to-airport">City to Airport</option>
                        <option value="airport-to-city">Airport to City</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="pickup">Pickup Location</Label>
                        <Input
                          id="pickup"
                          ref={pickupInputRef}
                          value={bookingData.pickup}
                          onChange={(e) => setBookingData({...bookingData, pickup: e.target.value})}
                          placeholder="Search pickup location on Google Maps"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="drop">Drop Location</Label>
                        <Input
                          id="drop"
                          ref={dropInputRef}
                          value={bookingData.drop}
                          onChange={(e) => setBookingData({...bookingData, drop: e.target.value})}
                          placeholder="Search drop location on Google Maps"
                          required
                        />
                      </div>
                    </div>

                    {mapsApiKey && bookingData.pickup && bookingData.drop && (
                      <div className="rounded-lg overflow-hidden border">
                        <iframe
                          title="Google Maps route preview"
                          className="w-full h-64"
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          src={`https://www.google.com/maps/embed/v1/directions?key=${mapsApiKey}&origin=${encodeURIComponent(bookingData.pickup)}&destination=${encodeURIComponent(bookingData.drop)}`}
                        ></iframe>
                      </div>
                    )}

                    {!mapsApiKey && (
                      <p className="text-sm text-amber-600">
                        Add <code>REACT_APP_GOOGLE_MAPS_API_KEY</code> in your environment to enable Google Maps suggestions and route preview.
                      </p>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="date">Travel Date</Label>
                        <Input
                          id="date"
                          type="date"
                          value={bookingData.date}
                          onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="time">Travel Time</Label>
                        <Input
                          id="time"
                          type="time"
                          value={bookingData.time}
                          onChange={(e) => setBookingData({...bookingData, time: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    <p className="text-sm text-gray-600">
                      <strong>Note:</strong> Night charges extra: 10% on automatic meter reading (12:00 AM to 6:00 AM)
                    </p>

                    <Button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold" size="lg">
                      Book Your Taxi via WhatsApp
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="fixed">
                  <div className="py-8 text-center text-gray-600">
                    <p>Fixed fare packages coming soon. Please use Quick Booking or contact us directly.</p>
                  </div>
                </TabsContent>

                <TabsContent value="packages">
                  <div className="py-8 text-center text-gray-600">
                    <p>Special packages available on request. Please contact us for customized tour packages.</p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Services Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4">What We Offer</Badge>
            <h2 className="text-4xl font-bold mb-4">Start Your Journey with Bengaluru Cabs</h2>
            <p className="text-gray-600">We successfully cope with tasks of varying complexity, provide long-term guarantees and regularly master new technologies.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Clock, title: "24/7 Availability", desc: "Round-the-clock taxi service for all your travel needs" },
              { icon: MapPin, title: "Airport Transfers", desc: "Reliable airport pickup and drop services starting from ₹99" },
              { icon: DollarSign, title: "Fixed Pricing", desc: "Transparent pricing with no hidden charges" },
              { icon: Shield, title: "Professional Drivers", desc: "Experienced and verified drivers for safe journeys" },
              { icon: Car, title: "Clean Vehicles", desc: "Well-maintained and sanitized cars for comfort" },
              { icon: CheckCircle, title: "Easy Booking", desc: "Quick and hassle-free booking process" }
            ].map((service, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mb-4">
                    <service.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle>{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{service.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4">Transparent Pricing</Badge>
            <h2 className="text-4xl font-bold mb-4">No hidden charges, pay only for what you use</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-2 border-yellow-500">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl">AC Sedan</CardTitle>
                <div className="text-5xl font-bold text-yellow-500 my-4">₹24<span className="text-2xl">/km</span></div>
                <CardDescription>Comfortable air-conditioned sedan for premium travel</CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-3xl">Non-AC Hatchback</CardTitle>
                <div className="text-5xl font-bold text-gray-700 my-4">₹18<span className="text-2xl">/km</span></div>
                <CardDescription>Budget-friendly option for city rides</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>

      {/* Service Areas */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4">Service Areas</Badge>
            <h2 className="text-4xl font-bold mb-4">Popular Locations We Serve</h2>
            <p className="text-gray-600">Drop-pickup taxi services starting from ₹99 across Bengaluru</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "KEB Colony, Hoodi", desc: "Excellent connectivity to metro stations and IT hubs like Whitefield and Outer Ring Road" },
              { name: "Kaveri Nagar, Mahadevapura", desc: "Prime locality with easy access to major Bangalore areas and excellent infrastructure" },
              { name: "Kasavanahalli", desc: "Strategic location between Sarjapur Road, Electronic City, and Outer Ring Road" },
              { name: "Whitefield", desc: "Major IT hub with excellent connectivity to airport and city center" },
              { name: "Electronic City", desc: "Prime tech park area with regular airport transfers" },
              { name: "Koramangala", desc: "Popular residential and commercial hub with 24/7 taxi service" }
            ].map((location, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-48 overflow-hidden">
                  <img src="/bengaluru-bg.png" alt={location.name} className="w-full h-full object-cover" />
                </div>
                <CardHeader>
                  <CardTitle>{location.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{location.desc}</p>
                  <Button variant="outline" className="w-full">Book Now</Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Badge variant="secondary" className="text-lg px-6 py-2">150+ Locations Covered</Badge>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-yellow-500">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-black mb-4">Call Us Now & Book Your Taxi For Your Next Ride!</h2>
          <p className="text-black mb-8">We successfully cope with tasks of varying complexity and regularly master new technologies.</p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="bg-black text-white hover:bg-gray-800">
              <Phone className="mr-2" /> Call: +91 94494 49510
            </Button>
            <Button size="lg" variant="outline" className="border-black text-black hover:bg-black hover:text-white" onClick={handleWhatsApp}>
              <MessageCircle className="mr-2" /> WhatsApp Us
            </Button>
          </div>
        </div>
      </div>

      {/* Blog Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <Badge className="mb-4">Recent Posts</Badge>
            <h2 className="text-4xl font-bold mb-4">Blog Articles</h2>
            <p className="text-gray-600">Stay updated with the latest news and travel tips from Bengaluru Cabs</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Drop-Pickup Taxi Services For KIA From Whitefield Starts@₹99", category: "Airport Services", date: "March 15, 2025" },
              { title: "Airport Taxi Services - Complete Guide to Bengaluru Airport Transfers", category: "Travel Guide", date: "March 12, 2025" },
              { title: "KSTDC Airport Taxi - Your Trusted Partner for City to Airport Transfers", category: "Company News", date: "March 10, 2025" }
            ].map((post, index) => (
              <Card key={index} className="overflow-hidden hover:shadow-xl transition-shadow">
                <div className="h-48 overflow-hidden">
                  <img src="/bengaluru-bg.png" alt={post.title} className="w-full h-full object-cover" />
                </div>
                <CardHeader>
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <Badge variant="secondary">{post.category}</Badge>
                    <span>{post.date}</span>
                  </div>
                  <CardTitle className="text-xl">{post.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button variant="link" className="px-0 text-yellow-600">Read More →</Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg">View All Articles</Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <img src="/logo.png" alt="Bengaluru Cabs" className="w-48 h-auto mx-auto mb-6" />
          <div className="flex gap-4 justify-center mb-6">
            <Button className="bg-green-600 hover:bg-green-700" onClick={handleWhatsApp}>
              <MessageCircle className="mr-2" /> WhatsApp Us
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Phone className="mr-2" /> Call Now
            </Button>
          </div>
          <p className="text-gray-400 text-sm">
            Made with <a href="https://app.emergent.sh" target="_blank" rel="noopener noreferrer" className="text-yellow-500 hover:underline">Emergent</a>
          </p>
        </div>
      </footer>
    </div>
  );
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}>
            <Route index element={<Home />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
