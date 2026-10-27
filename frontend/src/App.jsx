
import { useEffect,useMemo,useState } from "react";
import "./App.css";

function App() {
  const [vehicles,setVehicles]=useState([]);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState("");
  const [search,setSearch]=useState("");
  const [fuel,setFuel]=useState("All");
  const [transmission,setTransmission]=useState("All");
  const [sort,setSort]=useState("default");

  useEffect(()=>{
    fetch("http://localhost:8080/api/vehicles")
      .then(response=>{
        if(!response.ok) throw new Error("Failed to load vehicles");
        return response.json();
      })
      .then(data=>setVehicles(data))
      .catch(()=>setError("Unable to load vehicles. Please check the backend."))
      .finally(()=>setLoading(false));
  },[]);

  const filteredVehicles=useMemo(()=>{
    let result=vehicles.filter(vehicle=>{
      const matchesSearch=vehicle.model.toLowerCase().includes(search.toLowerCase());
      const matchesFuel=fuel==="All" || vehicle.fuelType===fuel;
      const matchesTransmission=transmission==="All" || vehicle.transmission===transmission;

      return matchesSearch && matchesFuel && matchesTransmission;
    });

    if(sort==="low") {
      result.sort((a,b)=>Number(a.rentalRate)-Number(b.rentalRate));
    } else if(sort==="high") {
      result.sort((a,b)=>Number(b.rentalRate)-Number(a.rentalRate));
    }

    return result;
  },[vehicles,search,fuel,transmission,sort]);

  function resetFilters() {
    setSearch("");
    setFuel("All");
    setTransmission("All");
    setSort("default");
  }

  return (
    <div className="app">
      <nav className="navbar">
        <h2>Drive<span>Ease</span></h2>
        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#vehicles">Vehicles</a>
          <a href="#about">About</a>
        </div>
        <button className="nav-button" onClick={()=>document.getElementById("vehicles").scrollIntoView({behavior:"smooth"})}>
          Explore Cars
        </button>
      </nav>

      <section className="hero" id="home">
        <div className="hero-content">
          <p className="eyebrow">YOUR JOURNEY, YOUR RULES</p>
          <h1>Find your perfect<br/>ride. <span>Drive your way.</span></h1>
          <p className="hero-description">
            Discover the right vehicle for every journey.
            Simple rentals, transparent pricing, and total freedom.
          </p>
          <button onClick={()=>document.getElementById("vehicles").scrollIntoView({behavior:"smooth"})}>
            Browse Vehicles →
          </button>
        </div>
        <div className="hero-decoration">DRIVE<br/>YOUR<br/>WAY.</div>
      </section>

      <section className="vehicles-section" id="vehicles">
        <div className="section-heading">
          <div>
            <p className="eyebrow">OUR COLLECTION</p>
            <h2>Choose your ride</h2>
          </div>
          <p>Find a vehicle that fits your journey.</p>
        </div>

        <div className="vehicle-filters">
          <input
            type="text"
            placeholder="Search by vehicle model..."
            value={search}
            onChange={event=>setSearch(event.target.value)}
          />

          <select value={fuel} onChange={event=>setFuel(event.target.value)}>
            <option value="All">All Fuel Types</option>
            <option value="Petrol">Petrol</option>
            <option value="Diesel">Diesel</option>
            <option value="CNG">CNG</option>
            <option value="Electric">Electric</option>
            <option value="Hybrid">Hybrid</option>
          </select>

          <select value={transmission} onChange={event=>setTransmission(event.target.value)}>
            <option value="All">All Transmissions</option>
            <option value="Manual">Manual</option>
            <option value="Automatic">Automatic</option>
          </select>

          <select value={sort} onChange={event=>setSort(event.target.value)}>
            <option value="default">Sort by Price</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
          </select>

          <button className="reset-button" onClick={resetFilters}>
            Reset
          </button>
        </div>

        {loading && <p className="message">Loading vehicles...</p>}
        {error && <p className="message error">{error}</p>}

        {!loading && !error && (
          <>
            <p className="results-count">
              Showing {filteredVehicles.length} of {vehicles.length} vehicles
            </p>

            {filteredVehicles.length===0 ? (
              <div className="no-results">
                <h3>No vehicles found</h3>
                <p>Try changing your search or filters.</p>
                <button className="reset-button" onClick={resetFilters}>Clear Filters</button>
              </div>
            ) : (
              <div className="vehicle-grid">
                {filteredVehicles.map(vehicle=>(
                  <article className="vehicle-card" key={vehicle.vehicleId}>
                    <div className="vehicle-visual">
                      <div className="vehicle-placeholder">{vehicle.model}</div>
                      <span className="vehicle-category">VEHICLE #{vehicle.vehicleId}</span>
                      <span className={`status ${vehicle.status?.toLowerCase()}`}>
                        {vehicle.status}
                      </span>
                    </div>
                    <div className="vehicle-details">
                      <h3>{vehicle.model}</h3>
                      <p className="registration">{vehicle.registrationNo}</p>
                      <div className="vehicle-specs">
                        <span>{vehicle.fuelType}</span>
                        <span>{vehicle.transmission}</span>
                      </div>
                      <div className="vehicle-bottom">
                        <p><strong>₹{Number(vehicle.rentalRate).toLocaleString("en-IN")}</strong> / day</p>
                        <button
                          disabled={vehicle.status!=="Available"}
                          onClick={()=>alert(`Booking flow for ${vehicle.model} will be added next!`)}
                        >
                          {vehicle.status==="Available"?"Book Now":"Unavailable"}
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </>
        )}
      </section>

      <footer id="about">
        <h2>Drive<span>Ease</span></h2>
        <p>Your journey starts here.</p>
        <p>Vehicle Rental Management System · College Project</p>
      </footer>
    </div>
  );
}

export default App;
