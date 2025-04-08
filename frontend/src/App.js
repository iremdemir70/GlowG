import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const baseUrl = "http://localhost:5000";


import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Register from "./pages/Register/Register";
import SkinTypeTest from "./pages/SkinTypeTest/SkinTypeTest";

function RouterSetup() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/register" element={<Register />} />
        <Route path="/skin-test" element={<SkinTypeTest />} />
      </Routes>
    </BrowserRouter>
  );
}


function App() {
  const [description, setDescription] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [eventsList, setEventsList] = useState([]);
  const [eventId, setEventId] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle input changes for normal and edit inputs
  const handleChange = (e, field) => {
    if (field === "edit") {
      setEditDescription(e.target.value);
    } else {
      setDescription(e.target.value);
    }
  };

  // Fetch events from the server
  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/events`);
      const { events } = response.data;
      setEventsList(events);
    } catch (err) {
      console.error("Error fetching events:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editDescription && eventId) {
        // Update existing event
        const response = await axios.put(`${baseUrl}/events/${eventId}`, {
          description: editDescription,
        });
        const updatedEvent = response.data.event;
        const updatedList = eventsList.map((event) =>
          event.id === eventId ? updatedEvent : event
        );
        setEventsList(updatedList);
      } else {
        // Create new event
        const response = await axios.post(`${baseUrl}/events`, {
          description,
        });
        setEventsList([...eventsList, response.data]);
      }
      // Reset form fields
      setDescription("");
      setEditDescription("");
      setEventId(null);
    } catch (err) {
      console.error("Error submitting event:", err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle deleting an event
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      setLoading(true);
      try {
        await axios.delete(`${baseUrl}/events/${id}`);
        const updatedList = eventsList.filter((event) => event.id !== id);
        setEventsList(updatedList);
      } catch (err) {
        console.error("Error deleting event:", err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  // Toggle edit mode for an event
  const toggleEdit = (event) => {
    setEventId(event.id);
    setEditDescription(event.description);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="App">
      <section className="form-section">
        {/* Add new event form */}
        <form onSubmit={handleSubmit}>
          <label htmlFor="description">Description</label>
          <input
            onChange={(e) => handleChange(e, "description")}
            type="text"
            name="description"
            id="description"
            value={description}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </section>

      <section className="events-section">
        {loading ? (
          <p className="loading-text">Loading events...</p>
        ) : (
          <ul>
            {eventsList.map((event) => (
              <li key={event.id} className="event-item">
                {eventId === event.id ? (
                  // Edit form for a specific event
                  <form onSubmit={handleSubmit}>
                    <input
                      onChange={(e) => handleChange(e, "edit")}
                      type="text"
                      name="editDescription"
                      id="editDescription"
                      value={editDescription}
                      required
                    />
                    <button type="submit" disabled={loading}>
                      {loading ? "Saving..." : "Save"}
                    </button>
                  </form>
                ) : (
                  <>
                    {/* Display event description */}
                    <span>{event.description}</span>
                    <button onClick={() => toggleEdit(event)}>Edit</button>
                    <button onClick={() => handleDelete(event.id)}>Delete</button>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default App;
