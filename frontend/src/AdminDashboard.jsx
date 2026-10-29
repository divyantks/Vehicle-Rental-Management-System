
import { useEffect,useState } from "react";
import "./AdminDashboard.css";

function AdminDashboard() {
    const [stats,setStats]=useState({
        totalVehicles:0,
        totalCustomers:0,
        totalBookings:0,
        pendingBookings:0
    });
    const [bookings,setBookings]=useState([]);
    const [loading,setLoading]=useState(true);
    const [error,setError]=useState("");

    useEffect(()=>{
        async function loadDashboard() {
            try {
                const [statsResponse,bookingsResponse]=await Promise.all([
                    fetch("http://localhost:8080/api/admin/dashboard"),
                    fetch("http://localhost:8080/api/bookings")
                ]);

                if(!statsResponse.ok || !bookingsResponse.ok) {
                    throw new Error("Failed to load dashboard data.");
                }

                const statsData=await statsResponse.json();
                const bookingsData=await bookingsResponse.json();

                setStats(statsData);
                setBookings(bookingsData.slice(-5).reverse());
            } catch(err) {
                setError("Dashboard data load nahi hua. Check karo backend running hai.");
            } finally {
                setLoading(false);
            }
        }

        loadDashboard();
    },[]);

    const cards=[
        {title:"Total Vehicles",value:stats.totalVehicles},
        {title:"Total Customers",value:stats.totalCustomers},
        {title:"Total Bookings",value:stats.totalBookings},
        {title:"Pending Bookings",value:stats.pendingBookings}
    ];

    return (
        <div className="admin-page">
            <aside className="admin-sidebar">
                <h2>DriveEase</h2>
                <p className="admin-label">ADMIN PANEL</p>
                <a href="/admin" className="active">Dashboard</a>
                <a href="/#vehicles">Vehicles</a>
                <a href="/#my-bookings">Bookings</a>
                <a href="/">Customer Website</a>
            </aside>

            <main className="admin-main">
                <header className="admin-header">
                    <div>
                        <p className="admin-label">OVERVIEW</p>
                        <h1>Admin Dashboard</h1>
                        <p>Manage your DriveEase rental business.</p>
                    </div>
                    <a href="/" className="admin-home-link">View Website ↗</a>
                </header>

                {loading ? (
                    <p className="admin-message">Loading dashboard...</p>
                ) : error ? (
                    <p className="admin-error">{error}</p>
                ) : (
                    <>
                        <section className="admin-stats">
                            {cards.map((card)=>(
                                <div className="admin-stat-card" key={card.title}>
                                    <p>{card.title}</p>
                                    <h2>{card.value}</h2>
                                </div>
                            ))}
                        </section>

                        <section className="admin-bookings">
                            <div className="admin-section-heading">
                                <div>
                                    <h2>Recent Bookings</h2>
                                    <p>Latest booking records from the database</p>
                                </div>
                                <span>{stats.totalBookings} total</span>
                            </div>

                            {bookings.length===0 ? (
                                <p className="admin-message">No bookings found.</p>
                            ) : (
                                <div className="admin-table-wrapper">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Booking ID</th>
                                                <th>Customer ID</th>
                                                <th>Vehicle ID</th>
                                                <th>Booking Date</th>
                                                <th>Amount</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {bookings.map((booking)=>(
                                                <tr key={booking.bookingId}>
                                                    <td>#{booking.bookingId}</td>
                                                    <td>{booking.customerId}</td>
                                                    <td>{booking.vehicleId}</td>
                                                    <td>{booking.bookingDate}</td>
                                                    <td>₹{booking.totalEstimatedAmount}</td>
                                                    <td>
                                                        <span className={"admin-status "+String(booking.status||"").toLowerCase()}>
                                                            {booking.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </section>
                    </>
                )}
            </main>
        </div>
    );
}

export default AdminDashboard;
